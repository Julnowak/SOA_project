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
      const [productPrice, setProductPrice] = useState(0.00);
      const params = useParams();


      if (username && params.id){
      (
        async () => {
            const response = await fetch(`http://127.0.0.1:8001/api/productuser/${params.id}`);

            const product: Product = await response.json();

            // @ts-ignore
            setSeller(product.username);
            setProductName(product.name);
            setProductId(product.id);
            setProductPrice(product.price);
            }
        )();
      }


      if (username && seller && seller != username && params.id && productId){

        ( async () => {
              try {
              const response = await fetch('http://127.0.0.1:8002/api/chatroom/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      username,
                      seller,
                      productId,
                      productName,
                      productPrice
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
        console.log(room)}

      const navigate = useNavigate();
      if (room){
          navigate(`/chatroom/${room}`)
      }

        return (
            <div>
                HELLO
            </div>
        );
};

export default CrateChatroom;