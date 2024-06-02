import React, {useEffect, useState} from "react";
import {useLocation, Link, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Product} from "../interfaces/product";
import {Button} from "react-bootstrap";

const ProductSite = () => {
const { state } = useLocation();
console.log(state)

const [name, setName] = useState('');
const [price, setPrice] = useState('');
const [image, setImage] = useState('');
const [likes, setLikes] = useState('');
const [seller, setSeller] = useState('');
const [description, setDescription] = useState('');
const [userType, setUserType] = useState(localStorage.getItem('user_type') as string | null)
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
                // @ts-ignore
                setLikes(product.likes);
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
    }, [params.id]);


  return (
      <div>

            <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <img style={{margin: 30, borderRadius: 20}} src={`http://localhost:8000${image}`} height={'400'} />
            </div>
            <div>

              <div>
                <h1 style={{textAlign: "center"}}>{name}{" "}</h1>
                <div style={{ margin: "auto", width: 300, textAlign: "center"}}>
                    <h3>Cena: {price}{" "} zł</h3>
                    <h4>Sprzedawca: {seller}{" "}</h4>
                    <h5>Polubienia: {likes}{" "}</h5>
                </div>
                    <div style={{ margin: "auto", marginTop: 30, marginBottom: 30, width: 400, textAlign: "justify", wordWrap: "break-word"}}>
                        <h3 >Opis produktu</h3>
                        {description}
                    </div>


              </div>
            </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
              <div style={{display: "inline-flex", margin: "auto"}}>
                  {userType === 'klient'? <Button style={{margin: 20}} variant="dark" ><Link style={{textDecoration: "none", color: "white"}} to="#">Kup produkt</Link></Button>: null }
                  <br/>
                  {userType === 'klient'? <Button style={{margin: 20}} variant="dark" ><Link style={{textDecoration: "none", color: "white"}} to={`/createChatroom/${params.id}`}>Negocjuj</Link></Button>: null }
              </div>
          </div>



      </div>

  );
};

export default ProductSite;