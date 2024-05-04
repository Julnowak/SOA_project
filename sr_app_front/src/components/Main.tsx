import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {Link} from "react-router-dom";

const Main = () => {
    const [products, setProducts] = useState([] as Product[]);

    useEffect(() => {
        (
            async () => {
                const response = await fetch('http://localhost:8000/api/products/');

                const data = await response.json();

                setProducts(data);
            }
        )();
    }, []);

    const like = async (id: number) => {
        await fetch(`http://localhost:8000/api/products/${id}/like/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        });

        setProducts(products.map(
            (p: Product) => {
                if (p.id === id) {
                    p.likes++;
                }

                return p;
            }
        ));
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
                                                    <Link style={{textDecoration:'none'}} to={`/products_view/${p.id}`}
                                                          state = {{ products: p }}>
                                                    <div className="card mb-4 shadow-sm">
                                                        <div className="card-body">
                                                            <p className="card-text">{p.name}</p>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="btn-group">
                                                                    <button type="button"
                                                                            className="btn btn-sm btn-outline-secondary"
                                                                            onClick={() => like(p.id)}
                                                                    >
                                                                        Like
                                                                    </button>
                                                                </div>
                                                                <small className="text-muted">{p.likes} likes</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </Link>
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