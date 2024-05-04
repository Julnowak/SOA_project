import React from "react";
import { useLocation, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";

const ProductSite = () => {
const { state } = useLocation();
console.log(state)

  return (
      <div>
          <Form>
            <div>
              <div>
                <strong>Id:</strong> {state.products.id}{" "}
              </div>
              <div>
                <strong>Name:</strong> {state.products.name}{" "}
              </div>
            </div>
          </Form>

          <Link to='#'>Kup produkt</Link>
          <Link to='#'>Negocjuj</Link>

      </div>

  );
};

export default ProductSite;