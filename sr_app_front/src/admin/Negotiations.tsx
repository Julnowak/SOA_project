import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {Link, useNavigate} from "react-router-dom";

interface Negotiation{
    id: number;
    seller: string;
    buyer: string;
    product: string;
    status: string;
    product_name: string;
    new_offer_producent: number;
    new_offer_customer: number;
}

const Negotiations = () => {
const [username, setUsername] = useState('' as string| null);
const [user_type, setUserType] = useState('' as string| null);
const [serverFlag, setServerFlag] = useState(false);
const [negotiations, setNegotiations] = useState([] as Negotiation[]);
const [available, setAvailable] = useState(false)

useEffect(
    () => {

        setUsername(localStorage.getItem('username'));
        setUserType(localStorage.getItem('user_type'));

        if (username && user_type){
            ( async () => {
              try {
              const response = await fetch('http://127.0.0.1:8002/api/allroom/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      username,
                      user_type,
                  })
                });
              setServerFlag(true);
              const data = await response.json();
                // console.log(data)
              setNegotiations(data);
              if (data.length !== 0){
                  setAvailable(true)
              }
          } catch {

                  setServerFlag(false);
                  console.log('dddd')
              }
          }
          )();
        }


    }, [user_type, username]);


const navigate = useNavigate();
    // @ts-ignore
const goRouteId = (room) => {
   navigate(`/chatroom/${room}`);
  }

  if (available){
  return (
    <div style={{margin: 20}}>
        { serverFlag?
            <div>
            <h1 style={{textAlign: "center", margin: 40}}>Twoje negocjacje</h1>
        <table  className="table table-striped table-sm">
        <thead>
          <tr style={{textAlign: "center"}}>
            <th style={{border: '1px solid black'}}>ID</th>
            <th style={{border: '1px solid black'}}>Nr produktu</th>
            <th style={{border: '1px solid black'}}>Nazwa</th>
            <th style={{border: '1px solid black'}}>Sprzedawca</th>
            <th style={{border: '1px solid black'}}>Nabywca</th>
            <th style={{border: '1px solid black'}}>Cena [zł]</th>
            <th style={{border: '1px solid black'}}>Status</th>
            <th style={{border: '1px solid black'}}>Strona</th>
          </tr>
        </thead>

        <tbody>
        {negotiations.map((n:Negotiation) => {
                            return (
                                <tr key={n.id} style={ {textAlign: "center"} }>
                                  <td  style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}} onClick={()=> goRouteId(n.id)}>{n.id}</td>
                                  <td style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}} onClick={()=> goRouteId(n.id)}>{n.product}</td>
                                    <td style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}} onClick={()=> goRouteId(n.id)}>{n.product_name}</td>
                                    <td style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}} onClick={()=> goRouteId(n.id)}>{n.seller}</td>
                                    <td style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}} onClick={()=> goRouteId(n.id)}>{n.buyer}</td>
                                    <td style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}} onClick={()=> goRouteId(n.id)}>{n.new_offer_producent}</td>
                                    <td style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}} onClick={()=> goRouteId(n.id)}>{n.status}</td>
                                    <td style={ n.status === 'Zakończono'? {border: '1px solid black', backgroundColor: "lightgray"} : {border: '1px solid black'}}><Link to={`/products_view/${n.product}`}> Klik</Link></td>
                                  <td >
                                      <div className="btn-group mr-2">

                                      </div>
                                  </td>
                                </tr>


                            )
                        })}

        </tbody>

        </table>
        </div>:
            <div style={{ textAlign: "center", padding:60}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="currentColor"
                     className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                    <path
                        d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
                    <path
                        d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                </svg>
                <h1 style={{textAlign:"center", marginTop:20}}>Serwer nie działa :(</h1>
            </div>
        }


    </div>
  );}else{
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <svg style={{ margin: 'auto', display: 'block', marginBottom: 20 }} xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor"
                         className="bi bi-wechat" viewBox="0 0 16 16">
                        <path
                            d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356"/>
                        <path
                            d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0"/>
                    </svg>
                    <h3>Brak negocjacji do wyświetlenia</h3>
                </div>
            </div>
        )
    }
};



export default Negotiations;