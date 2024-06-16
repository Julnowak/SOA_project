import React, {useEffect, useState} from "react";
import {Product} from "../interfaces/product";
import {Link, useNavigate} from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([] as Product[])
    const [available, setAvailable] = useState(false)
    const [username] = useState(localStorage.getItem('username') as string | null)
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {

        const newSocket = new WebSocket(`ws://127.0.0.1:8001/ws/product_socket/`);
        // @ts-ignore
        setSocket(newSocket);
        newSocket.onopen = () => console.log("WebSocket connected");
        newSocket.onclose = () => {
            console.log("WebSocket disconnected");
        };
        return () => {
            if (socket?.readyState === 1) {
                newSocket.close();
            }
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

    useEffect(
        () => {
            (async () => {
                    try {
                        const response = await fetch('http://127.0.0.1:8001/api/productuser/', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                username,
                            })
                        });

                        const data = await response.json();

                        setProducts(data);
                        if (data.length !== 0) {
                            setAvailable(true);
                        }
                    } catch {
                        console.log('dddd')
                    }
                }
            )();

        }, [username]);

    const del = async (id: number) => {
        if (window.confirm("Do you want to delete item?")) {
            console.log(id)
            if (socket && id) {

                const data = {
                    productId: id,
                    username: username,
                    call_type: "product_deleted"
                };
                socket.send(JSON.stringify(data));
            }

            await fetch(`http://localhost:8000/api/products/${id}`, {
                method: 'DELETE'
            });

            setProducts(products.filter((p: Product) => p.id !== id));
            if (products.filter((p: Product) => p.id !== id).length === 0) {
                setAvailable(false)
            }
        }
    };

    const navigate = useNavigate();
    // @ts-ignore
    const goRouteId = (id) => {
        navigate(`/products_view/${id}`);
    }


    if (available) {
        return (
            <div>
                <h1 style={{margin: 20, textAlign: "center"}}>Panel producenta</h1>
                <h2 style={{margin: 20, textAlign: "center"}}>Witaj, {localStorage.getItem('username')}!</h2>

                <div style={{display: "inline-flex", margin: 20, width: "100"}}>
                    <h2 style={{marginRight: 20, width: "90"}}>Twoje produkty</h2>
                    <Link to={'/admin/products/create'} style={{color: "black", textDecoration: "none"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                             className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                    </Link>
                </div>

                <div style={{margin: 20}} className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                        <tr style={{textAlign: "center"}}>
                            <th style={{border: '1px solid black'}}>ID</th>
                            <th style={{border: '1px solid black'}}>Obraz</th>
                            <th style={{border: '1px solid black'}}>Nazwa</th>
                            <th style={{border: '1px solid black'}}>Polubienia</th>
                            <th style={{border: '1px solid black'}}>Cena [zł]</th>
                            <th style={{border: '1px solid black'}}>Akcja</th>
                        </tr>
                        </thead>

                        <tbody>
                        {products.map((p: Product) => {
                            return (

                                <tr key={p.id} style={{textAlign: "center", verticalAlign: "middle"}}>
                                    <td style={{border: '1px solid black'}} onClick={() => goRouteId(p.id)}>{p.id}</td>
                                    <td style={{border: '1px solid black'}} onClick={() => goRouteId(p.id)}><img
                                        src={`http://localhost:8000${p.image}`} style={{height: 100}} alt={''}/></td>
                                    <td style={{border: '1px solid black'}}
                                        onClick={() => goRouteId(p.id)}>{p.name}</td>
                                    <td style={{border: '1px solid black'}}
                                        onClick={() => goRouteId(p.id)}>{p.likes}</td>
                                    <td style={{border: '1px solid black'}}
                                        onClick={() => goRouteId(p.id)}>{p.price}</td>
                                    <td style={{border: '1px solid black'}}>
                                        <div className="btn-group mr-2">
                                            <a href='#' className='btn btn-sm btn-outline-secondary'
                                               onClick={() => del(p.id)}>
                                                Usuń
                                            </a>
                                            <Link to={`/admin/products/${p.id}/edit`}
                                                  className='btn btn-sm btn-outline-secondary'>Edytuj</Link>
                                        </div>
                                    </td>
                                </tr>

                            )
                        })}

                        </tbody>

                    </table>
                </div>
            </div>
        );

    } else {
        return (
            <div>
                <h1 style={{margin: 20, textAlign: "center"}}>Panel producenta</h1>
                <h2 style={{margin: 20, textAlign: "center"}}>Witaj, {localStorage.getItem('username')}!</h2>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <div style={{textAlign: 'center'}}>
                        <svg style={{margin: 40}} xmlns="http://www.w3.org/2000/svg" width="200" height="200"
                             fill="currentColor"
                             className="bi bi-box2-heart" viewBox="0 0 16 16">
                            <path d="M8 7.982C9.664 6.309 13.825 9.236 8 13 2.175 9.236 6.336 6.31 8 7.982"/>
                            <path
                                d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zm0 1H7.5v3h-6zM8.5 4V1h3.75l2.25 3zM15 5v10H1V5z"/>
                        </svg>
                        <h3>Nie dodałeś jeszcze żadnych produktów</h3>
                        <Link to={'/admin/products/create'}
                              style={{color: "black", textDecoration: "none", display: "inline-flex"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                                 className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path
                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                            <h4 style={{margin: 5, marginLeft: 10}}>Dodaj</h4>

                        </Link>
                    </div>
                </div>
            </div>
        )
    }

};

export default Products;