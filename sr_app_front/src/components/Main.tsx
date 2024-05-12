import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {Link} from "react-router-dom";

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
                                                        <div className="card-body">
                                                            <Link style={{textDecoration:'none'}} to={`/products_view/${p.id}`}
                                                            state = {{ products: p }}>
                                                            <img src={`http://localhost:8000${p.image}`} height="180" alt={p.image}/>
                                                            <p className="card-text">{p.name}</p></Link>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button"
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => like(p.id)}
                                                                    >
                                                                        Like
                                                                    </button>
                                                                </div>
                                                                <small className="text-muted">{p.price} zł</small>
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
};

export default Main;