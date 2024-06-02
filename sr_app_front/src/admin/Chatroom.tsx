import React, {useState, useEffect, useRef} from 'react';
import {Product} from "../interfaces/product";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import "../Scrollbar.css"
import Modal from "../components/Modal";


interface Message {
  username: string;
  message: string;
  timestamp: string;
}

const Chatroom = () => {
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const [username, setUsername] = useState<string|null|Message>("");
  const [seller, setSeller] = useState("");
  const [user_type, setUserType] = useState(localStorage.getItem('user_type'));
  const [product, setProduct] = useState(0); // id
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState<string|null>();
  const [messages, setMessages] = useState([] as Message[]);
  const [status, setStatus] = useState('');
  const [flag, setFlag] = useState(false);
  const params = useParams();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));

    if (username && params.id){
            ( async () => {
              try {
              const response = await fetch(`http://127.0.0.1:8002/api/chatroom/${params.id}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });

              const ans = await response.json();

              /// Odznaczyć potem
              setMessages(ans[0]);
              setSeller(ans[1].seller)
              setStatus(ans[1].status)
          } catch {
                  console.log('dddd')
              }
          }
    )();
    }

  }, );


  useEffect(() => {
    setUsername(localStorage.getItem("username"));

    if (username && params.id) {
      const newSocket = new WebSocket(`ws://127.0.0.1:8002/ws/chat/${params.id}/`);
      // @ts-ignore
        setSocket(newSocket);
        newSocket.onopen = () => console.log("WebSocket connected");
        newSocket.onclose = () => {
          console.log("WebSocket disconnected");
          // localStorage.removeItem("username");
        };
      return () => {
        newSocket.close();
      };
    }
  }, [username, params.id]);

  useEffect(() => {
    if (socket) {
      // @ts-ignore
        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // @ts-ignore
        setMessages((prevMessages) => [...prevMessages, data]);

      };
    }



  }, [socket]);



    // @ts-ignore
  const handleSubmit = (event) => {
    event.preventDefault();
    if (message && socket) {
      const data = {
        message: message,
        username: username,
        room: params.id
      };
        socket.send(JSON.stringify(data));
      setMessage(null);
    }
  };


  const end = async (id: string|undefined) => {
        if (window.confirm("Czy chcesz zakończyć konwersację?")){

            await fetch(`http://localhost:8002/api/chatroom/${id}/end`, {
                method: 'POST'
            }).then(e =>{setFlag(true);
        });


            // setProducts(products.filter((p: Product) => p.id !== id));
        }
    };

  const navigate = useNavigate();

  if (flag){
    navigate(`/negotiations`);
  }


  return (
    <div className="chat-app">
      <div className="chat-wrapper">
        <div className="active-users-container">
          <h2 style={{textAlign: "center"}}>{productName} - nr {product}</h2>
        </div>

        <div className="chat-container">
          <div style={{textAlign: "center"}} className="chat-header">Nr negocjacji: {params.id}</div>
          <div  className="scrollable-content"  style={{border: "1px solid lightgray", overflow: 'auto', display: "flex", flexDirection: "column", height: '600px', marginBottom: 40, marginLeft: 30, marginRight: 30, marginTop: 10}}>
            {messages.map((message, index) => (
               <div>
                <div key={index} className="message" style={message.username == username? ({backgroundColor: "lightgray",border: "1px solid black", borderRadius: 10, padding: 10, marginLeft: 100, marginRight: 10, marginTop: 20, marginBottom:0}): {backgroundColor: "white", borderRadius: 10, border: "1px solid black", padding: 10, marginLeft: 10, marginRight: 100, marginTop: 20, marginBottom:0}}>
                  <div className="message-content" style={{wordWrap: "break-word"}}>{message.message}</div>
                </div>
                <div style={message.username == username? ({textAlign: "right", marginLeft: 100, marginRight: 10, marginTop: 0, marginBottom:0}): { marginLeft: 10, marginRight: 100, marginTop: 0, marginBottom:0}}>
                    {message.timestamp?.slice(0,10)}, {message.timestamp?.slice(11,16)}
                    <div>
                        {message.username}
                    </div>
                </div>
               </div>

            ))}
          </div>
          <div style={{margin: 30}}>
          {status != 'Zakończono'? (
              <Form onSubmit={handleSubmit} className="d-flex align-items-end">

              <Form.Control style={{borderColor: "black", marginRight: 20}}
                type="text"
                placeholder="Wpisz wiadomość..."
                onChange={(event) => setMessage(event.target.value)}
              />
              <Button variant="dark" style={{marginRight: 20}} type="submit">Wyślij</Button>
            </Form>


          ) : null}
          </div>
        </div>
      </div>

      <div style={{ margin: 30, textAlign: "center"}}>


      {status === 'Zakończono'? (
            <Button style={{marginLeft: 10, marginRight: 10}} variant="dark">Wznów</Button>
      ) : null}

      {user_type === 'producent' && status !== 'Zakończono'? (
          <div style={{display: "inline-flex"}}>
              <div style={{marginLeft:10, marginRight: 10}}>
                  <Modal />
              </div>

            <Button style={{marginLeft: 10, marginRight: 10}} variant="dark" onClick={()=> end(params.id)}>
                Zakończ czat
            </Button>

          </div>

      ) : null}

      {user_type === 'klient' && status !== 'Zakończono'? (
          <div>
            <Button style={{marginLeft: 10, marginRight: 10}} variant="dark">Kup</Button>
            <Modal />
            <Button style={{marginLeft: 10, marginRight: 10}} variant="dark" onClick={()=> end(params.id)}>Zakończ czat</Button>
          </div>
      ) : null}
      </div>

    </div>
  );
};

export default Chatroom;