import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Product} from "../interfaces/product";

const BuySite = () => {
    const [username, setUsername] = useState<string|null>("");
  const [seller, setSeller] = useState("");
  const [user_type, setUserType] = useState(localStorage.getItem('user_type'));
  const [product, setProduct] = useState(0); // id
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0.00);
  const [image, setImage] = useState('');
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
              setSeller(ans[1].seller)
              setProduct(ans[1].product)
              setProductName(ans[1].product_name)
              setProductPrice(ans[1].new_offer_producent)
          } catch {
                  console.log('dddd')
              }
          }
    )();
    }

  }, );


    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${product}`);
                const p: Product = await response.json();

                setImage(p.image);
            }


        )();

    }, [product]);

    return (
        <div>
            <h1 style={{textAlign: "center", margin: 30 }}>Zamówienie</h1>
            <div>

                <div style={{}}>
                    <img src={`http://localhost:8000${image}`}/>

                    <h3>Do zapłaty: <b>{productPrice} zł</b></h3>
                    <h4>Koszt dostawy: Bezpłatna</h4>

                    <Button variant="dark">Zatwierdź</Button>
                </div>
            </div>
        </div>
    );
};

export default BuySite;