import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import {Product} from "../interfaces/product";


const ProductsCreate = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [imageURL, setImageURL] = useState('');
    const [description, setDescription] = useState('');
    const [username, setUsername] = useState<string|null>(localStorage.getItem("username"));
    const [socket, setSocket] = useState<WebSocket|null>(null);
    const [product, setProduct] = useState<null|Product>()

    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('image', image);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      // @ts-ignore
      formData.append('username', localStorage.getItem('username'));

      const response = await fetch('http://localhost:8000/api/products/', {
          method: 'POST',
          body: formData,
      });

      const ans = await response.json();
      setProduct(ans)


        if (ans.id && socket) {

        const data = {
          productId: ans.id,
          username: username,
          image: ans.image,
          is_bought: ans.is_bought,
          likes: ans.likes,
          name: ans.name,
          price: ans.price,
          description: description,
          call_type: "product_created"
        };
          socket.send(JSON.stringify(data));
          setRedirect(true);
        }

    };

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

    // @ts-ignore
    function handleChange(e) {
        setImageURL(URL.createObjectURL(e.target.files[0]));
        setImage(e.target.files[0])
    }



    if (redirect){
        return <Navigate to={'/admin/products'}/>
    }

    return (
        <div className="center" style={{width: 300, margin: '50px auto '}}>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Nazwa produktu</label>
                    <input type='text' className="form-control" name="title"
                    onChange={e => setName(e.target.value)}/>

                    <label>Obraz</label>
                    <img src={imageURL} style={{height: 300}} alt={''}/>
                    <input type='file' className="form-control" name="title"
                    onChange={handleChange} alt={'None'}/>

                    <label>Cena</label>
                    <input defaultValue={"0.00"} type='number' step="0.01" min="0.00" className="form-control" name="title"
                    onChange={e => setPrice(e.target.value)}/>

                    <label>Opis produktu</label>
                    <textarea placeholder={"Tutaj wpisz opis produktu"} className="form-control" name="title"
                    onChange={e => setDescription(e.target.value)}/>

                </div>
                <button type='submit' className='btn btn-outline-secondary'>Save</button>
            </form>
        </div>
    );
};

export default ProductsCreate;