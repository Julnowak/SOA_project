import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {useNavigate} from "react-router-dom";

const History = () => {
    const [products, setProducts] = useState([] as Product[])
    const [available, setAvailable] = useState(false)
    const [username] = useState(localStorage.getItem('username') as string | null)
    const [user_type] = useState(localStorage.getItem('user_type') as string | null)

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

    const navigate = useNavigate();
    // @ts-ignore
    const goRouteId = (id) => {
       navigate(`/products_view/${id}`);
      }


    return (
        <div>
            {user_type==="klient"?
                <div>
                    <h1 style={{textAlign: "center", margin: 40}}>Historia zakupów</h1>
                </div>:
                <div>
                    <h1 style={{textAlign: "center", margin: 40}}>Historia sprzedaży</h1>
                </div>
            }


            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Obraz</th>
                    <th>Nazwa</th>
                    <th>Polubienia</th>
                    <th>Cena pierwotna</th>
                    <th>Cena sprzedaży</th>
                    <th>Kupujący</th>
                    <th>Status</th>
                    <th>Negocjacja</th>
                  </tr>
                </thead>

                <tbody>
                {products.map((p:Product) => {
                    return (

                        <tr key={p.id} >
                          <td onClick={()=> goRouteId(p.id)}>{p.id}</td>
                          <td onClick={()=> goRouteId(p.id)}><img src={`http://localhost:8000${p.image}`} style={{height: 100}} alt={''}/></td>
                          <td onClick={()=> goRouteId(p.id)}>{p.name}</td>
                          <td onClick={()=> goRouteId(p.id)}>{p.likes}</td>
                          <td onClick={()=> goRouteId(p.id)}>{p.price}</td>
                        </tr>

                    )
                })}

                </tbody>

              </table>
            </div>
        </div>
    );
};

export default History;