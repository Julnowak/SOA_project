import React, {SyntheticEvent, useState} from 'react';
import {Navigate} from "react-router-dom";


const ProductsCreate = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [imageURL, setImageURL] = useState('');


    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', name);
      formData.append('price', price);
        console.log(formData.values())
      await fetch('http://localhost:8000/api/products/', {
          method: 'POST',
          body: formData,
      });

      setRedirect(true);
    };

    // @ts-ignore
    function handleChange(e) {
        setImageURL(URL.createObjectURL(e.target.files[0]));
        setImage(e.target.files[0])

        console.log(imageURL)
    }


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

                    <label>Obraz</label>
                    <img src={imageURL} style={{height: 300}} alt={''}/>
                    <input type='file' className="form-control" name="title"
                    onChange={handleChange} alt={'None'}/>

                    <label>Price</label>
                    <input type='number' className="form-control" name="title"
                    onChange={e => setPrice(e.target.value)}/>
                </div>
                <button type='submit' className='btn btn-outline-secondary'>Save</button>
            </form>
        </div>
    );
};

export default ProductsCreate;