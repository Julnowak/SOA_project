import React, {useEffect, useState} from "react";
import {useLocation, Link, useParams} from "react-router-dom";
import {Product} from "../interfaces/product";
import {Button} from "react-bootstrap";

const ProductSite = () => {
    const {state} = useLocation();
    console.log(state)

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [likes, setLikes] = useState('');
    const [seller, setSeller] = useState('');
    const [isBought, setIsBought] = useState<boolean|null>(null);
    const [description, setDescription] = useState('');
    const [userType] = useState(localStorage.getItem('user_type') as string | null)
    const params = useParams();


    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${params.id}`);

                const product: Product = await response.json();

                setName(product.name);
                setDescription(product.description);
                setPrice(`${product.price}`);
                setImage(product.image);
                setIsBought(product.is_bought)
            }
        )();


        (
            async () => {
                const response = await fetch(`http://127.0.0.1:8001/api/productuser/${params.id}`);

                const product: Product = await response.json();

                // @ts-ignore
                setSeller(product.username);
            }


        )();

        (
            async () => {
                try {
                    const response = await fetch(`http://localhost:8001/api/get_likes/${params.id}`, {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json',},
                    });

                    const data = await response.json();
                    setLikes(data.likes_num);
                } catch (e) {
                    // @ts-ignore
                    console.log(e)
                }
            }
        )();
    }, [params.id]);

    if (isBought){
        return (
        <div>
            <h1 style={{ textAlign: "center", backgroundColor: "lightgray", padding: 20}}>Produkt nie jest już na sprzedaż</h1>
            <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <img style={{margin: 30, borderRadius: 20, filter: 'grayscale(1)'}} src={`http://localhost:8000${image}`} alt={"Obraz"} height={'400'}/>
            </div>
            <div style={{ marginBottom: 20}}>

                <div style={{backgroundColor: "lightgray", padding: 20, width:500, margin: "auto",
                            borderRadius: 20}}>
                    <h1 style={{textAlign: "center"}}>{name}{" "}</h1>
                    <div style={{margin: "auto", width: 300, textAlign: "center"}}>
                        <h3>Cena: {price}{" "} zł</h3>
                        <h4>Sprzedawca: {seller}{" "}</h4>
                        <h5>Polubienia: {likes}{" "}</h5>
                    </div>
                    <div style={{
                        margin: "auto",
                        marginTop: 30,
                        marginBottom: 30,
                        width: 400,
                        textAlign: "justify",
                        wordWrap: "break-word"
                    }}>
                        <h3 style={{margin: "auto", width: 300, textAlign: "center"}}>Opis produktu</h3>
                        <p style={{marginTop:20}}>
                            {description}
                        </p>
                    </div>


                </div>
            </div>

        </div>

    );
    }else{
        return (
        <div>

            <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <img style={{margin: 30, borderRadius: 20}} src={`http://localhost:8000${image}`} alt={"Obraz"} height={'400'}/>
            </div>
            <div>

                <div>
                    <h1 style={{textAlign: "center"}}>{name}{" "}</h1>
                    <div style={{margin: "auto", width: 300, textAlign: "center"}}>
                        <h3>Cena: {price}{" "} zł</h3>
                        <h4>Sprzedawca: {seller}{" "}</h4>
                        <h5>Polubienia: {likes}{" "}</h5>
                    </div>
                    <div style={{
                        margin: "auto",
                        marginTop: 30,
                        marginBottom: 30,
                        width: 400,
                        textAlign: "justify",
                        wordWrap: "break-word"
                    }}>
                        <h3 style={{margin: "auto", width: 300, textAlign: "center"}}>Opis produktu</h3>
                        <p style={{marginTop:20}}>
                            {description}
                        </p>
                    </div>


                </div>
            </div>

            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div style={{display: "inline-flex", margin: "auto"}}>
                    {userType === 'klient' ? <Button style={{margin: 20}} variant="dark"><Link
                        style={{textDecoration: "none", color: "white"}} to={`/${params.id}/buy/prod`}>Kup
                        produkt</Link></Button> : null}
                    <br/>
                    {userType === 'klient' ? <Button style={{margin: 20}} variant="dark"><Link
                        style={{textDecoration: "none", color: "white"}}
                        to={`/createChatroom/${params.id}`}>Negocjuj</Link></Button> : null}
                </div>
            </div>


        </div>

    );
    }

};

export default ProductSite;