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

              const data = await response.json();
                // console.log(data)
              setNegotiations(data);
          } catch {
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
    </div>
  );
};



export default Negotiations;