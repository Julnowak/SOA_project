import React, {useEffect, useState} from "react";
import {Product} from "../interfaces/product";
import {Link} from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([])

    useEffect(
        () => {
          ( async () => {
              const response = await fetch('http://localhost:8000/api/products/', {
                });

              const data = await response.json();

              setProducts(data);
          }
          )();

        }, []);
    
    const del = async (id: number) => {
        if (window.confirm("Do you want to delete item?")){

            await fetch(`http://localhost:8000/api/products/${id}`, {
                method: 'DELETE'
            });

            setProducts(products.filter((p: Product) => p.id !== id));
        }
    };

    return (
        <div>
            <h2>Products</h2>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Likes</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                {products.map((p:Product) => {
                    return (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.likes}</td>
                          <td>
                              <div className="btn-group mr-2">
                                  <a href='#' className='btn btn-sm btn-outline-secondary'
                                  onClick={() => del(p.id)}>
                                      Delete
                                  </a>
                                  <Link to={`/admin/products/${p.id}/edit`} className='btn btn-sm btn-outline-secondary'>Edit</Link>
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
};

export default Products;