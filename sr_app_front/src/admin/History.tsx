import React, {useEffect, useState} from 'react';

interface Transaction {
    id: number,
    seller: number,
    buyer: number,
    product: string,
    name: string,
    likes: number,
    chat: number,
    price: number,
    finalPrice: number,
    date: string
}

const History = () => {
    const [transactions, setTransactions] = useState([] as Transaction[])
    const [available, setAvailable] = useState(false)
    const [username] = useState(localStorage.getItem('username') as string | null)
    const [user_type] = useState(localStorage.getItem('user_type') as string | null)
    const [user_id] = useState(localStorage.getItem('user_id') as number | null)

    useEffect(
        () => {
            (async () => {
                    try {
                        await fetch('http://127.0.0.1:8001/api/productuser/', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                username,
                            })
                        });
                    } catch {
                        console.log('dddd')
                    }
                }
            )();

            (
                async () => {
                    const response = await fetch(`http://127.0.0.1:8000/api/transactions/`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            user_type: user_type,
                            user_id: username
                        })
                    });

                    const data = await response.json();
                    setTransactions(data);
                    // @ts-ignore
                    console.log(data)
                    if (data.length !== 0) {
                        setAvailable(true);
                        console.log(data)
                    }
                }
            )();


        }, [user_id, user_type, username]);


    if (available) {
        return (
            <div>
                {user_type === "klient" ?
                    <div>
                        <h1 style={{textAlign: "center", margin: 40}}>Historia zakupów</h1>
                    </div> :
                    <div>
                        <h1 style={{textAlign: "center", margin: 40}}>Historia sprzedaży</h1>
                    </div>
                }


                <div className="table-responsive" style={{textAlign: "center", margin: 40}}>
                    <table className="table table-striped table-sm">
                        <thead>
                        <tr>
                            <th style={{border: '1px solid black'}}>ID</th>
                            <th style={{border: '1px solid black'}}>Nazwa</th>
                            <th style={{border: '1px solid black'}}>Polubienia</th>
                            <th style={{border: '1px solid black'}}>Cena pierwotna</th>
                            <th style={{border: '1px solid black'}}>Cena sprzedaży</th>
                            {user_type === "klient" ?
                                <th style={{border: '1px solid black'}}>Sprzedawca</th>:
                                <th style={{border: '1px solid black'}}>Kupujący</th>
                            }
                            <th style={{border: '1px solid black'}}>Negocjacja</th>
                            <th style={{border: '1px solid black'}}>Czas transakcji</th>
                        </tr>
                        </thead>

                        <tbody>
                        {transactions.map((t: Transaction) => {
                            return (

                                <tr key={t.id} style={ {textAlign: "center"} }>
                                    <td style={{border: '1px solid black'}}>{t.id}</td>
                                    <td style={{border: '1px solid black'}}>{t.name}</td>
                                    <td style={{border: '1px solid black'}}>{t.likes}</td>
                                    <td style={{border: '1px solid black'}}>{t.price}</td>
                                    <td style={{border: '1px solid black'}}>{t.finalPrice}</td>
                                    {user_type === "klient" ?
                                        <td style={{border: '1px solid black'}}>{t.seller}</td>:
                                        <td style={{border: '1px solid black'}}>{t.buyer}</td>}
                                    <td style={{border: '1px solid black'}}>{!t.chat ? "-------------" : t.chat}</td>
                                    <td style={{border: '1px solid black'}}>{t.date.toString().slice(0, 10)}, {t.date.toString().slice(11, 16)}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh'}}>
                <div style={{textAlign: 'center'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor"
                         className="bi bi-emoji-frown" viewBox="0 0 16 16" style={{marginBottom: 20}}>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path
                            d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
                    </svg>
                    <h3>Brak transakcji do wyświetlenia</h3>
                </div>
            </div>

        )
    }
};

export default History;