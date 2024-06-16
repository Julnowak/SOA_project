import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Navigate, useParams} from "react-router-dom";
import {Product} from "../interfaces/product";

const ProductsEdit = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [description, setDescription] = useState('');
    const [flag, setFlag] = useState(false)
    const [redirect, setRedirect] = useState(false);
    const [socket, setSocket] = useState<WebSocket|null>(null);
    const [username] = useState<string|null>(localStorage.getItem("username"));
    const params = useParams();

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`http://localhost:8000/api/products/${params.id}`);

                const product: Product = await response.json();

                setName(product.name);
                setPrice(`${product.price}`);
                setImage(product.image);
                setDescription(product.description)
            }
        )();
    }, [params.id]);

    useEffect(() => {

          const newSocket = new WebSocket(`ws://127.0.0.1:8001/ws/product_socket/`);
          // @ts-ignore
            setSocket(newSocket);
            newSocket.onopen = () => console.log("WebSocket connected");
            newSocket.onclose = () => {
              console.log("WebSocket disconnected");
            };
          return () => {
              if (socket?.readyState === 1) {newSocket.close();}
          };

      }, [socket?.readyState]);

      useEffect(() => {
        if (socket) {
          // @ts-ignore
            socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)

          };
        }

      }, [socket]);

    
    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();

      const formData = new FormData();
      // formData.append('image', image);
      formData.append('name', name);
      formData.append('price', price);
      formData.append('image', image);
      formData.append('description', description);

      const response = await fetch(`http://localhost:8000/api/products/${params.id}`, {
          method: 'PUT',
          body: formData,
      });

      const ans = await response.json();

        if (ans.id && socket) {

        const data = {
          productId: ans.id,
          username: username,
          image: ans.image,
          is_bought: ans.is_bought,
          likes: ans.likes,
          name: ans.name,
          price: ans.price,
          description: ans.description,
          call_type: "product_created"
        };
          socket.send(JSON.stringify(data));
          setRedirect(true);
        }

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

                    <label>Opis produktu</label>
                    <textarea placeholder={description} className="form-control" name="title"
                    onChange={e => setDescription(e.target.value)}/>
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

                    <label>Opis produktu</label>
                    <textarea placeholder={description} className="form-control" name="title"
                    onChange={e => setDescription(e.target.value)}/>
                </div>
                <button style={{textAlign: "center", margin: "auto"}} type='submit' className='btn btn-outline-secondary'>Zapisz</button>
            </form>
        </div>
    );
};

export default ProductsEdit;