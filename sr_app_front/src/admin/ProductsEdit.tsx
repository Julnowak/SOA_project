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
        <div>
            <h1 style={{margin: 20, textAlign: "center"}}>Dodawanie produktu</h1>
            <div className="center" style={{width: 300, margin: 50, marginLeft: "auto", marginRight: "auto"}}>
            <form onSubmit={submit}>
                <div className="form-group">
                    <div style={{marginTop: 10, marginBottom: 10}} >
                        <label>Nazwa produktu</label>
                        <input type='text' style={{border:"1px black solid"}} defaultValue={name} className="form-control" name="title"
                               onChange={e => setName(e.target.value)}/>
                    </div>

                    <div style={{marginTop: 10, marginBottom: 10}}>
                        <label>Obraz</label>
                        <img src={imageURL} defaultValue={`http://localhost:8000${image}`} style={{height: "auto", maxWidth: 300, marginBottom: 20}} alt={''}/>
                        <input type='file' style={{border:"1px black solid"}} className="form-control" name="title"
                               onChange={handleChange} alt={'None'}/>
                    </div>

                    <div style={{marginTop: 10, marginBottom: 10}}>
                        <label>Cena</label>
                        <input style={{border:"1px black solid"}} type='number' step=".01" min="0"  defaultValue={price} className="form-control"
                               name="title"
                               onChange={e => setPrice(e.target.value)}/>
                    </div>

                    <div style={{marginTop: 10, marginBottom: 10}}>
                        <label>Opis produktu</label>
                        <textarea value={description} style={{border:"1px black solid"}} className="form-control" name="title"
                                  onChange={e => setDescription(e.target.value)}/>
                    </div>

                </div>
                <button style={{marginLeft: 70, marginTop: 20, width: 150}} type='submit' className='btn btn-dark'>Zapisz</button>
            </form>
        </div>
        </div>
    );
    }

    return (
        <div>
            <h1 style={{margin: 20, textAlign: "center"}}>Dodawanie produktu</h1>
            <div className="center" style={{width: 300, margin: 50, marginLeft: "auto", marginRight: "auto"}}>
            <form onSubmit={submit}>
                <div className="form-group">
                    <div style={{marginTop: 10, marginBottom: 10}} >
                        <label>Nazwa produktu</label>
                        <input type='text' style={{border:"1px black solid"}} defaultValue={name} className="form-control" name="title"
                               onChange={e => setName(e.target.value)}/>
                    </div>

                    <div style={{marginTop: 10, marginBottom: 10}}>
                        <label>Obraz</label>
                        <img src={`http://localhost:8000${image}`} defaultValue={`http://localhost:8000${image}`} style={{height: "auto", maxWidth: 300, marginBottom: 20}} alt={''}/>
                        <input type='file' style={{border:"1px black solid"}} className="form-control" name="title"
                               onChange={handleChange} alt={'None'}/>
                    </div>

                    <div style={{marginTop: 10, marginBottom: 10}}>
                        <label>Cena</label>
                        <input style={{border:"1px black solid"}} type='number' step=".01" min="0"  defaultValue={price} className="form-control"
                               name="title"
                               onChange={e => setPrice(e.target.value)}/>
                    </div>

                    <div style={{marginTop: 10, marginBottom: 10}}>
                        <label>Opis produktu</label>
                        <textarea value={description} style={{border:"1px black solid"}} className="form-control" name="title"
                                  onChange={e => setDescription(e.target.value)}/>
                    </div>

                </div>
                <button style={{marginLeft: 70, marginTop: 20, width: 150}} type='submit' className='btn btn-dark'>Zapisz</button>
            </form>
        </div>
        </div>
    );
};


export default ProductsEdit;