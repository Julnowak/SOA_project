import React, {useEffect, useState} from "react";
import {useLocation, Link, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Product} from "../interfaces/product";

const ProductSite = () => {
const { state } = useLocation();
console.log(state)

const [name, setName] = useState('');
const [price, setPrice] = useState('');
const [image, setImage] = useState('');
const [likes, setLikes] = useState('');
const [seller, setSeller] = useState('');
const [userType, setUserType] = useState(localStorage.getItem('user_type') as string | null)
const params = useParams();


useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${params.id}`);

                const product: Product = await response.json();

                setName(product.name);
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
          <Form>
            <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <img  src={`http://localhost:8000${image}`} height={'400'} />
            </div>
            <div>

              <div>
                <h1>{name}{" "}</h1>
                <h3>{price}{" "} zł</h3>
                <h3>Sprzedawca: {seller}{" "}</h3>
                <h5>Polubienia: {likes}{" "}</h5>
              </div>
            </div>
          </Form>

          <Link to='#'>Kup produkt</Link>
          <br/>
          {userType == 'klient'? <Link to={{pathname:`/createChatroom/${params.id}`}}>Negocjuj</Link>: null }


      </div>

  );
};

export default ProductSite;