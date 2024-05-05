import React, {useEffect, useState} from "react";
import { useLocation, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Product} from "../interfaces/product";

const ProductSite = () => {
const { state } = useLocation();
console.log(state)

const [product, setProduct] = useState('');

 useEffect(
    () => {
      ( async () => {
          try {
          const response = await fetch(`http://localhost:8000/api/products/${state.products.id}`, {
            });

          const response2 = await fetch(`http://localhost:8001/api/productuser/${state.products.id}`, {
            });

          const data = await response.json();
          const data2 = await response2.json();
          console.log(data2)

          setProduct(data);
      } catch {
              console.log('dddd')
          }
      }
      )();

    }, []);

  return (
      <div>
          <Form>
            <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <img  src={`http://localhost:8000${state.products.image}`} height={'400'}/>
            </div>
            <div>

              <div>
                <h1>{state.products.name}{" "}</h1>
                <h3>{state.products.price}{" "} zł</h3>
                <h5>Polubienia: {state.products.likes}{" "}</h5>
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