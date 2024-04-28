import React, {PropsWithRef, SyntheticEvent, useEffect, useState} from 'react';
import {Navigate, useParams} from "react-router-dom";
import {Product} from "../interfaces/product";

const ProductsEdit = (props: PropsWithRef<any>) => {
    const [name, setName] = useState('');
    const [redirect, setRedirect] = useState(false);
    const params = useParams();

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${params.id}`);

                const product: Product = await response.json();

                setName(product.name);
            }
        )();
    }, []);
    
    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();

      await fetch(`http://localhost:8000/api/products/${params.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              name,
          })
      });

      setRedirect(true);
    };

    if (redirect){
        return <Navigate to={'/admin/products'}/>
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type='text' defaultValue={name} className="form-control" name="name"
                    onChange={e => setName(e.target.value)}/>
                </div>
                <button type='submit' className='btn btn-outline-secondary'>Save</button>
            </form>
        </div>
    );
};

export default ProductsEdit;