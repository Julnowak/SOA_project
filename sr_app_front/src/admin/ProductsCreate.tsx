import React, {SyntheticEvent, useState} from 'react';
import {Navigate} from "react-router-dom";

const ProductsCreate = () => {
    const [name, setName] = useState('');
    const [redirect, setRedirect] = useState(false);
    
    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();

      await fetch('http://localhost:8000/api/products/', {
          method: 'POST',
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
                    <input type='text' className="form-control" name="title"
                    onChange={e => setName(e.target.value)}/>
                </div>
                <button type='submit' className='btn btn-outline-secondary'>Save</button>
            </form>
        </div>
    );
};

export default ProductsCreate;