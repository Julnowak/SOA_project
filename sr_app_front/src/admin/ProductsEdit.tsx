import React, {PropsWithRef, SyntheticEvent, useEffect, useState} from 'react';
import {Navigate, useParams} from "react-router-dom";
import {Product} from "../interfaces/product";

const ProductsEdit = (props: PropsWithRef<any>) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [flag, setFlag] = useState(false)
    const [redirect, setRedirect] = useState(false);
    const params = useParams();

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${params.id}`);

                const product: Product = await response.json();

                setName(product.name);
                setPrice(`${product.price}`);
                setImage(product.image);
            }
        )();
    }, [params.id]);
    
    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();

      const formData = new FormData();
      // formData.append('image', image);
      formData.append('name', name);
      formData.append('price', price);
      formData.append('image', image);
      // @ts-ignore
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }
      await fetch(`http://localhost:8000/api/products/${params.id}`, {
          method: 'PUT',
          body: formData,
      });

      setRedirect(true);
    };

    // @ts-ignore
    function handleChange(e) {
        setImageURL(URL.createObjectURL(e.target.files[0]));
        setImage(e.target.files[0])
        setFlag(true);
    }


    if (redirect){
        return <Navigate to={'/admin/products'}/>
    }

    if (flag){
        return (
        <div className="center" style={{width: 300, margin: '50px auto '}}>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Nazwa produktu</label>
                    <input type='text' defaultValue={name} className="form-control" name="name"
                    onChange={e => setName(e.target.value)}/>

                    <label>Obraz</label>
                    <img src={imageURL} defaultValue={`http://localhost:8000${image}`} style={{height: 300}} alt={''}/>
                    <input type='file'  className="form-control" name="title"
                    onChange={handleChange} alt={'None'}/>

                    <label>Price</label>
                    <input type='number' step=".01" min="0" defaultValue={price} className="form-control" name="title"
                    onChange={e => setPrice(e.target.value)}/>
                </div>
                <button type='submit' className='btn btn-outline-secondary'>Save</button>
            </form>
        </div>
    );
    }

    return (
        <div className="center" style={{width: 300, margin: '50px auto '}}>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Name</label>
                    <input style={{borderColor: "black", margin:20}} type='text' defaultValue={name} className="form-control" name="name"
                    onChange={e => setName(e.target.value)}/>

                    <label>Obraz</label>
                    <img src={`http://localhost:8000${image}`} defaultValue={`http://localhost:8000${image}`} style={{height: 300}} alt={''}/>
                    <input style={{borderColor: "black", margin:20}} type='file'  className="form-control" name="title"
                    onChange={handleChange} alt={'None'}/>

                    <label>Price</label>
                    <input style={{borderColor: "black", margin:20}} type='number' step=".01" min="0"  defaultValue={price} className="form-control" name="title"
                    onChange={e => setPrice(e.target.value)}/>
                </div>
                <button style={{textAlign: "center", margin: "auto"}} type='submit' className='btn btn-outline-secondary'>Zapisz</button>
            </form>
        </div>
    );
};

export default ProductsEdit;