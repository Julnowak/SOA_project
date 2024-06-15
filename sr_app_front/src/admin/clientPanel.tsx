import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {Link, useNavigate} from "react-router-dom";

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
              if (data.length !== 0){
                  setAvailable(true);
              }
          } catch {
                  console.log('dddd')
              }
          }
          )();
            }

        }, [user_id]);

    console.log(liked)
    if(available){
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
                          <td style={{border: '1px solid black'}} onClick={()=> goRouteId(p.id)}>{p.price}</td>
                          <td style={{border: '1px solid black'}}>
                              <div className="btn-group mr-2">
                                  <Link className='btn btn-sm btn-outline-secondary' to={`/createChatroom/${p.id}`}>Negocjuj</Link>
                                  <button className='btn btn-sm btn-outline-secondary'
                                  onClick={() => del(p.id)}>
                                      Usuń
                                  </button>
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
    }else{
        return (
            <div>
                <h1 style={{margin: 20, textAlign: "center"}}>Panel Klienta</h1>
                <h2 style={{margin: 20, textAlign: "center"}}>Witaj, {localStorage.getItem('username')}!</h2>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <svg style={{margin:40}} xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor"
                             className="bi bi-box2-heart" viewBox="0 0 16 16">
                            <path d="M8 7.982C9.664 6.309 13.825 9.236 8 13 2.175 9.236 6.336 6.31 8 7.982"/>
                            <path
                                d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4zm0 1H7.5v3h-6zM8.5 4V1h3.75l2.25 3zM15 5v10H1V5z"/>
                        </svg>
                        <h3>Nie polubiłeś jeszcze żadnych produktów</h3>
                        <h4>Odwiedź market, żeby to zmienić :)</h4>

                    </div>
                </div>
            </div>
        )
    }
};

export default ClientPanel;