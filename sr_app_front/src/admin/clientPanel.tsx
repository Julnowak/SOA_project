import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {useNavigate} from "react-router-dom";

const ClientPanel = () => {
    const [liked, setLiked] = useState([] as Product[])
    const [available, setAvailable] = useState(false)
    const [user_id] = useState(localStorage.getItem('user_id'))


    const navigate = useNavigate();
    // @ts-ignore
    const goRouteId = (id) => {
       navigate(`/products_view/${id}`);
      }

    const del = async (id: number) => {
            console.log(id)
            await fetch(`http://localhost:8001/api/unlike/${id}`, {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                      },
                body: JSON.stringify({
                      user_id,
                  })
            });

            setLiked(liked.filter((p: Product) => p.id !== id));

    };

    useEffect(
        () => {
            if (user_id){
                ( async () => {
              try {
              const response = await fetch('http://127.0.0.1:8001/api/likes/', {
                    method: 'POST',
                  headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({
                      user_id,
                  })
                });

              const data = await response.json();

              setLiked(data);
              setAvailable(true);
          } catch {
                  console.log('dddd')
              }
          }
          )();
            }

        }, [user_id]);

    console.log(liked)
    return (
        <div>
            <h1 style={{margin: 20, textAlign: "center"}}>Panel klienta</h1>
            <h2 style={{margin: 20, textAlign: "center"}}>Witaj, {localStorage.getItem('username')}!</h2>

            <div>
                <h3>Ulubione produkty</h3>
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
                {liked.map((p:Product) => {
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

export default ClientPanel;