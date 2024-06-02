import React, {useState, useEffect, useRef} from 'react';
import {Product} from "../interfaces/product";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import "../Scrollbar.css"
import "../components/Modal.css"

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
  const [productPrice, setProductPrice] = useState(0.00);
  const [proposition, setProposition] = useState(0.00);
  const [newPrice, setNewPrice] = useState(productPrice);
  const [message, setMessage] = useState<string|null>();
  const [messages, setMessages] = useState([] as Message[]);
  const [status, setStatus] = useState('');
  const [flag, setFlag] = useState(false);
  const params = useParams();
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
    setNewPrice(productPrice);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

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
              setProduct(ans[1].product)
              setProductName(ans[1].product_name)
              setProductPrice(ans[1].new_offer_producent)
              setProposition(ans[1].new_offer_customer)
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

      // @ts-ignore
  const handlePriceChange = (event) => {
    event.preventDefault();
    if (newPrice && socket) {
      toggleModal()
      const data = {
        new: newPrice,
        username: username,
        room: params.id,
        productId: product,
        user_type: user_type
      };
        socket.send(JSON.stringify(data));

    }
  };


  const end = async (id: string|undefined) => {
        if (window.confirm("Czy chcesz zakończyć konwersację?")){

            await fetch(`http://localhost:8002/api/chatroom/${id}/end`, {
                method: 'POST'
            }).then(e =>{setFlag(true);
        });

        }
    };

  // @ts-ignore
  const handleChange = (e) => {
    setNewPrice(e.target.value);
  };

  const navigate = useNavigate();

  if (flag){
    navigate(`/negotiations`);
  }


  return (
    <div className="chat-app">
      <div className="chat-wrapper">
        <div className="active-users-container">
          <h2 style={{textAlign: "center", marginTop: 20}}>{productName} - nr {product}</h2>
        </div>


        <div className="chat-container">
          <div style={{textAlign: "center", marginBottom: 20}} className="chat-header">Nr negocjacji: {params.id}</div>
          <h3 style={{textAlign: "center"}}>Aktualnie proponowana cena producenta: {productPrice} zł</h3>
          <h6 style={{textAlign: "center"}}>Klient prosi o zmianę na: {proposition} zł</h6>
            <div  className="scrollable-content" id="scrollable-content" style={{border: "1px solid lightgray", overflow: 'auto', display: "flex", flexDirection: "column", height: '500px', marginBottom: 40, marginLeft: 30, marginRight: 30, marginTop: 10}}>
            {messages.map((message, index) => (
               <div>
                <div key={index} className="message" style={message.username === username? ({backgroundColor: "lightgray",border: "1px solid black", borderRadius: 10, padding: 10, marginLeft: 100, marginRight: 10, marginTop: 20, marginBottom:0}): {backgroundColor: "white", borderRadius: 10, border: "1px solid black", padding: 10, marginLeft: 10, marginRight: 100, marginTop: 20, marginBottom:0}}>
                  <div className="message-content" style={{wordWrap: "break-word"}}>{message.message}</div>
                </div>
                <div style={message.username === username? ({textAlign: "right", marginLeft: 100, marginRight: 10, marginTop: 0, marginBottom:0}): { marginLeft: 10, marginRight: 100, marginTop: 0, marginBottom:0}}>
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

              <Form.Control id={"inputId"} style={{borderColor: "black", marginRight: 20}}
                type="text"
                placeholder="Wpisz wiadomość..."
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
              />
              <Button variant="dark" onClick={function () {
                // @ts-ignore
                document.getElementById("inputId").value = "";

              }} style={{marginRight: 20}} type="submit">Wyślij</Button>
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
                  <div>
                  <Button variant="dark" onClick={toggleModal}>Zaproponuj</Button>

                  {modal ? (
                    <div style={{overflow: "hidden"}}>
                        <div onClick={toggleModal} className="overlay"></div>

                          <div className="modal-content" style={{backgroundColor: "white"}}>
                            <Form onSubmit={handlePriceChange}>
                                  <h2> Nowa cena</h2>
                                  <Form.Control style={{marginTop:40, borderColor: "black", marginRight: 20}}
                                    type="number"
                                    min="0"
                                    step=".01"
                                    value={newPrice}
                                    onChange={handleChange}
                                  />
                                  <Button style={{margin:20, marginRight: 20}} variant="dark" type="submit">Zaakceptuj</Button>
                              </Form>
                            <Button className="close-modal" variant="red" onClick={toggleModal}>
                              ❌
                            </Button>
                          </div>

                    </div>
                  ): null}
                </div>
              </div>

            <Button style={{marginLeft: 10, marginRight: 10}} variant="dark" onClick={()=> end(params.id)}>
                Zakończ czat
            </Button>

          </div>

      ) : null}

      {user_type === 'klient' && status !== 'Zakończono'? (
          <div style={{display: "inline-flex"}}>
            <Button style={{marginLeft: 10, marginRight: 10}} variant="dark" onClick={function () {
              navigate(`/${params.id}/buy`);
            }}>Kup produkt</Button>
            <div>
            <Button variant="dark" onClick={toggleModal}>Zaproponuj</Button>

            {modal ? (
              <div style={{overflow: "hidden"}}>
                  <div onClick={toggleModal} className="overlay"></div>

                    <div className="modal-content" style={{backgroundColor: "white"}}>
                      <Form onSubmit={handlePriceChange}>
                            <h2> Nowa cena</h2>
                            <Form.Control style={{marginTop:40, borderColor: "black", marginRight: 20}}
                              type="number"
                              min="0"
                              step=".01"
                              value={newPrice}
                              onChange={handleChange}
                            />
                            <Button style={{margin:20, marginRight: 20}}  variant="dark" type="submit">Zaakceptuj</Button>
                        </Form>
                      <Button className="close-modal"  variant="red" onClick={toggleModal}>
                        ❌
                      </Button>
                    </div>

              </div>
            ): null}
          </div>
            <Button style={{marginLeft: 10, marginRight: 10}} variant="dark" onClick={()=> end(params.id)}>Zakończ czat</Button>
          </div>
      ) : null}
      </div>




    </div>
  );
};

export default Chatroom;