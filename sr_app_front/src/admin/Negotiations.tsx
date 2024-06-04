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
  );
};



export default Negotiations;