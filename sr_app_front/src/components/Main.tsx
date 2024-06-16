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
            console.log(data.likes)
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
                        <div className="album py-5 bg-light" >
                            <div className="container" >
                                <div className="row">
                                    {products.map(
                                        (p: Product) => {
                                            return (
                                                <div className="col-md-4" key={p.id} >
                                                    <div className="card mb-4 shadow-sm">

                                                        <div className="card-body">
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
                                                                            {!prod_ids.includes(p.id)?
                                                                                <div>
                                                                                    <svg style={{border: "none", cursor: "pointer"}} onClick={() => handleEvent(p.id)}
                                                                                         xmlns="http://www.w3.org/2000/svg"
                                                                                         width="40" height="40"
                                                                                         fill="currentColor"
                                                                                         color="red"
                                                                                         className="bi bi-suit-heart"
                                                                                         viewBox="0 0 16 16">
                                                                                        <path
                                                                                            d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                                                                                    </svg>
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    <svg style={{border: "none", cursor: "pointer"}} onClick={() => handleEvent(p.id)} xmlns="http://www.w3.org/2000/svg" color="red" width="40" height="40" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                                                                        <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"/>
                                                                                    </svg>
                                                                                </div>
                                                                            }

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