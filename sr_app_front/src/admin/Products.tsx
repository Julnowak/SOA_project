import React, {useEffect, useState} from "react";
import {Product} from "../interfaces/product";
import {Link, useNavigate} from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([] as Product[])
    const [available, setAvailable] = useState(false)
    const [username, setUsername] = useState(localStorage.getItem('username') as string | null)

    useEffect(
        () => {
          ( async () => {
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
              setAvailable(true);
          } catch {
                  console.log('dddd')
              }
          }
          )();

        }, [username]);
    
    const del = async (id: number) => {
        if (window.confirm("Do you want to delete item?")){

            await fetch(`http://localhost:8000/api/products/${id}`, {
                method: 'DELETE'
            });

            setProducts(products.filter((p: Product) => p.id !== id));
        }
    };

    const navigate = useNavigate();
    // @ts-ignore
    const goRouteId = (id) => {
       navigate(`/products_view/${id}`);
      }



    if (available){
        return (
        <div>
            <h1 style={{margin: 20, textAlign: "center"}}>Panel producenta</h1>
            <h2 style={{margin: 20, textAlign: "center"}}>Witaj, {localStorage.getItem('username')}!</h2>

            <div style={{display: "inline-flex", margin: 20}}>
            <h2 style={{ marginRight: 20}}>Twoje produkty</h2>
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
              <table  className="table table-striped table-sm">
                <thead>
                  <tr style={ {textAlign: "center"} }>
                    <th style={{border: '1px solid black'}}>ID</th>
                    <th style={{border: '1px solid black'}}>Obraz</th>
                    <th style={{border: '1px solid black'}}>Nazwa</th>
                    <th style={{border: '1px solid black'}}>Polubienia</th>
                    <th style={{border: '1px solid black'}}>Cena [zł]</th>
                    <th style={{border: '1px solid black'}}>Akcja</th>
                  </tr>
                </thead>

                <tbody>
                {products.map((p:Product) => {
                    return (

                        <tr key={p.id} style={ {textAlign: "center", verticalAlign: "middle"} }>
                          <td style={{border: '1px solid black'}} onClick={()=> goRouteId(p.id)}>{p.id}</td>
                          <td style={{border: '1px solid black'}} onClick={()=> goRouteId(p.id)}><img src={`http://localhost:8000${p.image}`} style={{height: 100}} alt={''}/></td>
                          <td style={{border: '1px solid black'}} onClick={()=> goRouteId(p.id)}>{p.name}</td>
                          <td style={{border: '1px solid black'}} onClick={()=> goRouteId(p.id)}>{p.likes}</td>
                          <td style={{border: '1px solid black'}} onClick={()=> goRouteId(p.id)}>{p.price}</td>
                          <td style={{border: '1px solid black'}}>
                              <div className="btn-group mr-2">
                                  <a href='#' className='btn btn-sm btn-outline-secondary'
                                  onClick={() => del(p.id)}>
                                      Usuń
                                  </a>
                                  <Link to={`/admin/products/${p.id}/edit`} className='btn btn-sm btn-outline-secondary'>Edytuj</Link>
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

    }
    else{
        return (<div>
                Error occured
            </div>
    )
    }

};

export default Products;