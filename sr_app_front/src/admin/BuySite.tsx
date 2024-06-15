import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Product} from "../interfaces/product";

const BuySite = () => {
  const [username, setUsername] = useState<string|null>("");
  const [seller, setSeller] = useState("");
  const [user_type, setUserType] = useState(localStorage.getItem('user_type'));
  const [product, setProduct] = useState<number|null>(0); // id
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));
  const [productName, setProductName] = useState("");
  const [isBought, setIsBought] = useState(false);
  const [productPrice, setProductPrice] = useState(0.00);
  const [image, setImage] = useState('');
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const [chat, setChat] = useState<number|null>(0);
  const params = useParams();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));

    if (username && params.type && params.id ){
            ( async () => {
              try {
                  if (params.type === "neg"){
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
                      setChat(ans[1].id)
                  }
                  else{
                      await (
                          async () => {
                              const response = await fetch(`http://localhost:8000/api/products/${params.id}`);
                              const p: Product = await response.json();

                              setImage(p.image);
                              setProductName(p.name)
                              // @ts-ignore
                              setProduct(params.id)
                              setProductPrice(p.price)
                              setIsBought(p.is_bought)
                          }


                      )();

                      await (
                          async () => {
                              const response = await fetch(`http://127.0.0.1:8001/api/productuser/${params.id}`);

                              const data = await response.json();

                              // @ts-ignore
                              setSeller(data.user_id);
                          }


                      )();

                  }

          } catch {
                  console.log('dddd')
              }
          }
    )();
    }

  }, );


  useEffect(() => {
  setUsername(localStorage.getItem("username"));

    if (username && product !== 0) {

      const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/sales/${product}/`);
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
  }, [username, product]);

  useEffect(() => {
    if (socket) {
      // @ts-ignore
        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data)

      };
    }

  }, [socket]);

  const navigate = useNavigate();

  // @ts-ignore
  const handleEvent = (event) => {
    event.preventDefault();
    if (product && socket) {
      const data = {
        product: product,
        seller: seller,
        buyer: userId,
        chat: chat,
        price: productPrice

      };
        socket.send(JSON.stringify(data));
      setProduct(null);
    }
    // navigate(`/history`);
  };





    useEffect(() => {
        if (product){
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${product}`);
                const p: Product = await response.json();
                setIsBought(p.is_bought)
                setImage(p.image);
            }


        )();}

    }, [product]);



    return (
        <div>
            { params.type === "prod"?
            <div>
                <h1 style={{textAlign: "center", margin: 30 }}>Zamówienie</h1>
                <div>

                    <div style={{margin: "auto", width: 340, padding:20}}>
                        <img src={`http://localhost:8000${image}`} width={300} style={{ borderRadius: 10, marginBottom: 40}}/>

                        <h3>Do zapłaty: <b>{productPrice} zł</b></h3>
                        <h4>Koszt dostawy: Bezpłatna</h4>
                        <h4>Kupiony? {isBought?.toString()}</h4>

                        <Button style={{marginTop: 20}} variant="dark" onClick={handleEvent}>Zatwierdź</Button>
                    </div>
                </div>
            </div>:
            <div>
                <h1 style={{textAlign: "center", margin: 30 }}>Zamówienie</h1>
                <div>

                    <div style={{margin: "auto", width: 340, padding:20}}>
                        <img src={`http://localhost:8000${image}`} width={300} style={{ borderRadius: 10, marginBottom: 40}}/>

                        <h3>Do zapłaty: <b>{productPrice} zł</b></h3>
                        <h4>Koszt dostawy: Bezpłatna</h4>
                        <h4>Kupiony? {isBought?.toString()}</h4>

                        <Button style={{marginTop: 20}} variant="dark" onClick={handleEvent}>Zatwierdź</Button>
                    </div>
                </div>
            </div>}
        </div>

    );
};

export default BuySite;