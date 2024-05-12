import React, { useState, useEffect } from 'react';
import {Product} from "../interfaces/product";
import {useParams} from "react-router-dom";

interface Message {
  username: string;
  message: string;
  timestamp: string;

}
const Chatroom = () => {
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const [username, setUsername] = useState<string|null|Message>("");
  const [seller, setSeller] = useState("");
  const [product, setProduct] = useState(0); // id
  const [productName, setProductName] = useState("");
  const [room, setRoom] = useState(0); // id
  const [message, setMessage] = useState<string|null>();
  const [messages, setMessages] = useState([] as Message[]);
  const params = useParams();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));

    (
        async () => {
            const response = await fetch(`http://127.0.0.1:8001/api/productuser/${params.id}`);

            const product: Product = await response.json();

            // @ts-ignore
            setSeller(product.username);
            setProductName(product.name)
            setProduct(product.id)
        }
    )();

    if (username && seller && product){
        ( async () => {
              try {
              const response = await fetch('http://127.0.0.1:8002/api/chatroom/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      username,
                      seller,
                      product
                  })
                });

              const data = await response.json();
              console.log(data);
              setRoom(data.id);

          } catch
              {
                  console.log('ddgege')
              }
          }
    )();
    }


    if (username && seller && product && room){
            ( async () => {
              try {
              const response = await fetch(`http://127.0.0.1:8002/api/chatroom/${room}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });

              const dataM = await response.json();
              console.log(dataM);
              /// Odznaczyć potem
              // setMessages(dataM);
          } catch {
                  console.log('dddd')
              }
          }
    )();
    }

  }, );


  useEffect(() => {
    setUsername(localStorage.getItem("username"));

    if (username && room) {
      const newSocket = new WebSocket(`ws://127.0.0.1:8002/ws/chat/${room}/`);
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
  }, [username, room]);

  useEffect(() => {
    if (socket) {
      // @ts-ignore
        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // @ts-ignore
        // setMessages((prevMessages) => [...prevMessages, data]);

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
        room: room
      };
        socket.send(JSON.stringify(data));
      setMessage(null);
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-wrapper">
        <div className="active-users-container">
          <h2>{productName} - nr {product}</h2>
        </div>

        <div className="chat-container">
          <div className="chat-header">Nr negocjacji: {room}</div>
          <div className="message-container">
            {messages.map((message, index) => (
              <div key={index} className="message">

                <div className="message-username">{message.username}:</div>
                <div className="message-content">{message.message}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type a message..."
              // value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;