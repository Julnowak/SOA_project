import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {useNavigate} from "react-router-dom";

interface Transaction {
    id: number,
    seller: number,
    buyer: number,
    product : string,
    chat : number,
    price : number,
    date : string
}

const History = () => {
    const [products, setProducts] = useState([] as Product[])
    const [transactions, setTransactions] = useState([] as Transaction[])
    const [available, setAvailable] = useState(false)
    const [username] = useState(localStorage.getItem('username') as string | null)
    const [user_type] = useState(localStorage.getItem('user_type') as string | null)
    const [user_id] = useState(localStorage.getItem('user_id') as number | null)

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

          } catch {
                  console.log('dddd')
              }
          }
          )();

          (
              async () => {
                  const response = await fetch(`http://127.0.0.1:8000/api/transactions/`,{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      user_type,
                      user_id
                  })
                  });

                  const data = await response.json();
                  setTransactions(data);
                  // @ts-ignore
                  console.log(data)
                  if(data.length !== 0){
                      setAvailable(true);
                      console.log(data)
                  }
              }


          )();


        }, [user_id, user_type, username]);

    const navigate = useNavigate();
    // @ts-ignore
    const goRouteId = (id) => {
       navigate(`/products_view/${id}`);
      }

    if (available){
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
                {transactions.map((p:Transaction) => {
                    return (

                        <tr key={p.id} >
                          <td onClick={()=> goRouteId(p.id)}>{p.id}</td>
                          {/*<td onClick={()=> goRouteId(p.id)}><img src={`http://localhost:8000${p.image}`} style={{height: 100}} alt={''}/></td>*/}
                          {/*<td onClick={()=> goRouteId(p.id)}>{p.name}</td>*/}
                          {/*<td onClick={()=> goRouteId(p.id)}>{p.likes}</td>*/}
                          <td onClick={()=> goRouteId(p.id)}>{p.price}</td>
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor"
                             className="bi bi-emoji-frown" viewBox="0 0 16 16" style={{ marginBottom: 20 }}>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
                        </svg>
                        <h3>Brak transakcji do wyświetlenia</h3>
                    </div>
                </div>

        )
    }
};

export default History;