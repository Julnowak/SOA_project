import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Product} from "../interfaces/product";

const CrateChatroom = () => {
      const [username, setUsername] = useState<string|null>(localStorage.getItem('username'));
      const [seller, setSeller] = useState("");
      const [user_type, setUserType] = useState(localStorage.getItem('user_type'));
      const [productName, setProductName] = useState("");
      const [room, setRoom] = useState(0); // id
      const [productId, setProductId] = useState(0); //id
      const params = useParams();
      const [flag, setFlag] = useState(true);


      if (username && params.id){
      (
        async () => {
            const response = await fetch(`http://127.0.0.1:8001/api/productuser/${params.id}`);

            const product: Product = await response.json();

            // @ts-ignore
            setSeller(product.username);
            setProductName(product.name);
            setProductId(product.id);
            }
        )();
      }


      if (username && seller && seller != username && params.id && productId  && flag){

        ( async () => {
              try {
              const response = await fetch('http://127.0.0.1:8002/api/chatroom/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      username,
                      seller,
                      user_type,
                      productId
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
        console.log(room)
      setFlag(false);}

      const navigate = useNavigate();
      if (room && !flag){
          navigate(`/chatroom/${room}`)
      }

        return (
            <div>
                HELLO
            </div>
        );
};

export default CrateChatroom;