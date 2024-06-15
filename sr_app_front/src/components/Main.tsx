import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {Link} from "react-router-dom";

const Main = () => {
    const [products, setProducts] = useState([] as Product[]);
    const [likes, setLikes] = useState([]);
    const [prod_ids, setProdIds] = useState([] as number[]);
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [user_id] = useState(localStorage.getItem('user_id'));
    const [user_type] = useState(localStorage.getItem('user_type'));
    const [socket, setSocket] = useState<WebSocket|null>(null);
    const [available, setAvailable] = useState(false);
    const [flag, setFlag] = useState(false)

    useEffect(() => {
        (
            async () => {
                try {
                const response = await fetch('http://localhost:8000/api/products/');

                const data = await response.json();
                setProducts(data);
                if(data.length !== 0){
                    setAvailable(true)
                }
                } catch {
                  console.log('dddd')
              }
            }
        )();
        
        if (!flag){
            (async () => {
            if (user_id) {
                try {
                    const response = await fetch('http://localhost:8001/api/all_likes/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ user_id }),
                    });
                    const data = await response.json();
                    setLikes(data);
                    // @ts-ignore
                    const ids = Object.values(data).map(item => item.product_id);
                    setProdIds(ids);

                    setFlag(true)
                } catch (error) {
                    console.log('Error fetching likes:', error);
                }
            }
        })()
        }
    // @ts-ignore
    }, [flag, likes.likes, prod_ids, user_id]);



  useEffect(() => {
  setUsername(localStorage.getItem("username"));

    if (username && products.length !== 0) {
      const newSocket = new WebSocket(`ws://127.0.0.1:8001/ws/user_socket/`);
      // @ts-ignore
        setSocket(newSocket);
        newSocket.onopen = () => console.log("WebSocket connected");
        newSocket.onclose = () => {
          console.log("WebSocket disconnected");
          // localStorage.removeItem("username");
        };
      return () => {
          if (newSocket.readyState === 1) {
            newSocket.close();}
      };
    }
  }, [username, products]);


  // @ts-ignore
    useEffect(() => {
    if (socket) {
      // @ts-ignore
        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log(data)
        // @ts-ignore
        if (data.length !== 0){
            // @ts-ignore
            // @ts-ignore
            const ids = Object.values(data.likes).map(item => item.product_id);
            setProdIds(ids);
        }

      };

    }

    // @ts-ignore
  }, [likes.likes, prod_ids, socket]);


  // @ts-ignore
  const handleEvent = async (id: number) =>  {
    if (username && socket && id) {
      const data = {
        username: username,
        productId: id,
        userId: user_id
      };
        socket.send(JSON.stringify(data));
      // setProduct(null);
    }
  };

    // @ts-ignore


    document.body.style.backgroundColor = "#ffffff";
    if (available){
    return (
        <div>

            <h1 style={{textAlign: "center"}}>Wszystkie produkty</h1>
            <main role="main">
                        <div className="album py-5 bg-light">
                            <div className="container">
                                <div className="row">
                                    {products.map(
                                        (p: Product) => {
                                            return (
                                                <div className="col-md-4" key={p.id}>
                                                    <div className="card mb-4 shadow-sm">

                                                        <div className="card-body" >
                                                            <div style={{height: '70%'}}>
                                                                <Link style={{textDecoration:'none'}} to={`/products_view/${p.id}`}
                                                                state = {{ products: p }}>
                                                                    <div style={{ height: '100%', width: '100%', margin: "auto"}}>
                                                                        <img style={{objectFit: 'contain', borderRadius: 10, height: '100%', width: '100%'}} src={`http://localhost:8000${p.image}`} alt={p.image}/>
                                                                    </div>
                                                                    <p style={{ margin: 10,textAlign: "center", color: "black", textDecoration: "none"}} className="card-text">{p.name}</p>
                                                                </Link>
                                                            </div>

                                                                <div style={{height: '30%'}}>

                                                                        {user_type === 'klient'?
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div className="btn-group">
                                                                                {!prod_ids.includes(p.id)?
                                                                                    <div>
                                                                                        <svg style={{border: "none", cursor: "pointer"}} onClick={() => handleEvent(p.id)}
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="32" height="32"
                                                                                            color="red"
                                                                                            fill="currentColor"
                                                                                            className="bi bi-heart"
                                                                                            viewBox="0 0 16 16">
                                                                                            <path
                                                                                                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                    :
                                                                                    <svg style={{border: "none", cursor: "pointer"}} onClick={() => handleEvent(p.id)}
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width="32" height="32"
                                                                                        color="red"
                                                                                        fill="currentColor"
                                                                                        className="bi bi-heart-fill"
                                                                                        viewBox="0 0 16 16">
                                                                                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                                                                    </svg>

                                                                                    }

                                                                            </div>
                                                                            <small className="text-muted">{p.price} zł</small>
                                                                        </div>
                                                                            :
                                                                        <div style={{textAlign:"center"}}>
                                                                            <small className="text-muted">{p.price} zł</small>
                                                                        </div>
                                                                        }



                                                                </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        </div>

                    </main>
        </div>
    );
    }else{
        return (
            <div>
                <h1 style={{textAlign: "center", margin:20}}>Wszystkie produkty</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <svg style={{ margin: 'auto', display: 'block', marginBottom: 40 }} xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor"
                             className="bi bi-search" viewBox="0 0 16 16">
                            <path
                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                        <h3>Nie znaleziono dostępnych produktów...</h3>
                    </div>
                </div>
            </div>

        )
    }
};

export default Main;