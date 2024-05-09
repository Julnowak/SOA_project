import React, {useEffect, useState} from "react";
import {useLocation, Link, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Product} from "../interfaces/product";

const ProductSite = () => {
const { state } = useLocation();
console.log(state)

const [product, setProduct] = useState('');
const [name, setName] = useState('');
const [price, setPrice] = useState('');
const [image, setImage] = useState('');
const [likes, setLikes] = useState('');
const params = useParams();


useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${params.id}`);

                const product: Product = await response.json();

                setName(product.name);
                setPrice(`${product.price}`);
                setImage(product.image);
                // setLikes(product.likes);
            }
        )();
    }, [params.id]);


  return (
      <div>
          <Form>
            <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <img  src={`http://localhost:8000${image}`} height={'400'}/>
            </div>
            <div>

              <div>
                <h1>{name}{" "}</h1>
                <h3>{price}{" "} zł</h3>
                <h5>Polubienia: {likes}{" "}</h5>
              </div>
            </div>
          </Form>

          <Link to='#'>Kup produkt</Link>
          <br/>
          <Link to='#'>Negocjuj</Link>

      </div>

  );
};

export default ProductSite;