import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {Link, useParams} from "react-router-dom";

const Main = () => {
    const [products, setProducts] = useState([] as Product[]);
    const [username, setUsername] = useState('' as string| null);


    useEffect(() => {
        (
            async () => {
                try {
                const response = await fetch('http://localhost:8000/api/products/');

                const data = await response.json();
                const un = localStorage.getItem('username')
                setUsername(un);
                setProducts(data);
                } catch {
                  console.log('dddd')
              }
            }
        )();
    }, []);

        // @ts-ignore
  const handleEvent = (event) => {
    event.preventDefault();
    // if (product && socket) {
    //   const data = {
    //     product: product,
    //   };
    //     socket.send(JSON.stringify(data));
    //   setProduct(null);
    // }
  };

    const like = async (id: number) => {
        try {
            await fetch(`http://localhost:8000/api/products/${id}/like`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username,
                })
            });

            setProducts(products.map(
                (p: Product) => {
                    if (p.id === id) {
                        p.likes++;
                    }

                    return p;
                }
            ));
        } catch {
                  console.log('dddd')
              }
    }

    const [socket, setSocket] = useState<WebSocket|null>(null);
  const params = useParams();

  useEffect(() => {
  setUsername(localStorage.getItem("username"));

    if (username && products) {
      const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/sales/`);
      // @ts-ignore
        setSocket(newSocket);
        newSocket.onopen = () => console.log("WebSocket connected");
        newSocket.onclose = () => {
          console.log("WebSocket disconnected");
          // localStorage.removeItem("username");
        };
      return () => {
        newSocket.close();
      };
    }
  }, [username, products]);

  useEffect(() => {
    if (socket) {
      // @ts-ignore
        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data)

      };
    }

  }, [socket]);



    document.body.style.backgroundColor = "#ffffff";
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
                                                        { !p.is_bought ?
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
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div className="btn-group">
                                                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => like(p.id)}>
                                                                                Like
                                                                            </button>
                                                                        </div>
                                                                        <small className="text-muted">{p.price} zł</small>
                                                                    </div>
                                                                </div>

                                                        </div>:
                                                        <div className="card-body" >X</div>}

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
};

export default Main;