import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import {Product} from "../interfaces/product";

const BuySite = () => {
    const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
    const [seller, setSeller] = useState("");
    const [product, setProduct] = useState<number | null>(0); // id
    const [likes, setLikes] = useState<number | null>(0); // id
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0.00);
    const [productFinalPrice, setProductFinalPrice] = useState(0.00);
    const [image, setImage] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [chat, setChat] = useState<number | null>(0);
    const params = useParams();

    useEffect(() => {

        if (username && params.type && params.id) {
            (async () => {
                    try {
                        if (params.type === "neg") {
                            const response = await fetch(`http://127.0.0.1:8002/api/chatroom/${params.id}`, {
                                method: 'GET',
                                headers: {'Content-Type': 'application/json'},
                            });
                            const ans = await response.json();

                            /// Odznaczyć potem
                            setSeller(ans[1].seller)
                            setProduct(ans[1].product)
                            setProductName(ans[1].product_name)

                            setProductFinalPrice(ans[1].new_offer_producent)
                            setChat(ans[1].id)
                        } else {
                            await (
                                async () => {
                                    const response = await fetch(`http://localhost:8000/api/products/${params.id}`);
                                    const p: Product = await response.json();

                                    setImage(p.image);
                                    setProductName(p.name)
                                    // @ts-ignore
                                    setProduct(params.id)
                                    setProductPrice(p.price)
                                    setLikes(p.likes)
                                }


                            )();

                            await (
                                async () => {
                                    const response = await fetch(`http://127.0.0.1:8001/api/productuser/${params.id}`);

                                    const data = await response.json();

                                    // @ts-ignore
                                    setSeller(data.username);
                                }


                            )();

                        }

                    } catch {
                        console.log('dddd')
                    }
                }
            )();
        }

    },);


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
                name: productName,
                likes: likes,
                seller: seller,
                buyer: username,
                chat: chat,
                price: productPrice,
                finalPrice: productFinalPrice,
            };
            socket.send(JSON.stringify(data));
            setProduct(null);
        }

        (
            async () => {
                await fetch(`http://localhost:8001/api/remove_product_likes/${product}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                });
            }
        )();

        (
            async () => {
                await fetch(`http://localhost:8002/api/chatroom/end/${product}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                });
            }
        )();

        navigate(`/history`);
    };

    useEffect(() => {
        if (product) {
            (
                async () => {
                    const response = await fetch(`http://localhost:8000/api/products/${product}`);
                    const p: Product = await response.json();
                    setImage(p.image);
                }
            )();
        }

    }, [product]);

    return (
        <div>
            {params.type === "prod" ?
                <div>
                    <h1 style={{textAlign: "center", margin: 30}}>Zamówienie</h1>
                    <div>

                        <div style={{margin: "auto", width: 340, padding: 20}}>
                            <img src={`http://localhost:8000${image}`} width={300}
                                 style={{borderRadius: 10, marginBottom: 40}} alt={"Obraz"}/>

                            <h3>Do zapłaty: <b>{productPrice} zł</b></h3>
                            <h4>Koszt dostawy: Bezpłatna</h4>
                            <h4 style={{marginTop: 30}}>Dane o produkcie:</h4>
                            <div style={{marginTop: 30}}>
                                <p>
                                    <b>Nazwa:</b> {productName}
                                </p>
                                <p>
                                    <b>Sprzedający:</b> {seller}
                                </p>
                            </div>

                            <Button style={{marginTop: 20}} variant="dark" onClick={handleEvent}>Zatwierdź</Button>
                        </div>
                    </div>
                </div> :
                <div>
                    <h1 style={{textAlign: "center", margin: 30}}>Zamówienie</h1>
                    <div>

                        <div style={{margin: "auto", width: 340, padding: 20}}>
                            <img src={`http://localhost:8000${image}`} width={300}
                                 style={{borderRadius: 10, marginBottom: 40}} alt={"Obraz"}/>

                            <h3>Do zapłaty: <b>{productFinalPrice} zł</b></h3>
                            <h4 style={{marginTop: 30}}>Koszt dostawy: Bezpłatna</h4>
                            <h4 style={{marginTop: 30}}>Dane o produkcie:</h4>
                            <div style={{marginTop: 30}}>
                                <p>
                                    Nazwa: {productName}
                                </p>
                                <p>
                                    Sprzedający: {seller}
                                </p>
                            </div>


                            <Button style={{marginTop: 20}} variant="dark" onClick={handleEvent}>Zatwierdź</Button>
                        </div>
                    </div>
                </div>}
        </div>

    );
};

export default BuySite;