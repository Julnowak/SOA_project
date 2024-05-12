import React, {useEffect, useState} from 'react';
import {Product} from "../interfaces/product";
import {Link, useNavigate} from "react-router-dom";

interface Negotiation{
    id: number;
    seller: string;
    buyer: string;
    product: string;
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
                console.log(data)
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
const goRouteId = (id) => {
   navigate(`/chatroom/${id}`);
  }
      
  return (
    <div className="table-responsive">
<table className="table table-striped table-sm">
<thead>
  <tr>
    <th>#</th>
     <th>Nr produktu</th>
    <th>Nazwa</th>
    <th>Sprzedający</th>
    <th>Cena</th>
  </tr>
</thead>

<tbody>
{negotiations.map((p:Negotiation) => {
                    return (

                        <tr key={p.id} >
                          <td onClick={()=> goRouteId(p.product)}>{p.id}</td>
                          <td onClick={()=> goRouteId(p.product)}>{p.product}</td>
                            <td onClick={()=> goRouteId(p.product)}>###########</td>
                            <td onClick={()=> goRouteId(p.product)}>{p.seller}</td>
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