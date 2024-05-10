import React, { useState, useEffect } from 'react';
import {Product} from "../interfaces/product";

interface Message {
  username: string;
  message: string;
  timestamp: string;

}
const Negotiations = () => {
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const [username, setUsername] = useState<string|null|Message>("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState<string|null>();
  const [messages, setMessages] = useState([] as Message[]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    console.log(username);

    const storedRoom = localStorage.getItem("room");
    if (storedRoom) {
      setRoom(storedRoom);
    } else {
      const input = prompt("Enter your room:");
      if (input) {
        setRoom(input);
        localStorage.setItem("room", input);
      }
    }

    if (username && room) {
      const newSocket = new WebSocket(`ws://127.0.0.1:8002/ws/chat/${room}/`);
      // @ts-ignore
        setSocket(newSocket);
        newSocket.onopen = () => console.log("WebSocket connected");
        newSocket.onclose = () => {
          console.log("WebSocket disconnected");
          // localStorage.removeItem("username");
          localStorage.removeItem("room");
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
        if (data.user_list) {
          setActiveUsers(data.user_list);
        } else {
          // @ts-ignore
            setMessages((prevMessages) => [...prevMessages, data]);
        }
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
      };
        socket.send(JSON.stringify(data));
      setMessage(null);
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-wrapper">
        <div className="active-users-container">
          <h2>Active Users ({activeUsers.length})</h2>
          <ul>
            {activeUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
        <div className="chat-container">
          <div className="chat-header">Chat Room: {room}</div>
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

export default Negotiations;