import React from 'react';

const ClientPanel = () => {
    return (
        <div>
            <h1 style={{margin: 20, textAlign: "center"}}>Panel klienta</h1>
            <h2 style={{margin: 20, textAlign: "center"}}>Witaj, {localStorage.getItem('username')}!</h2>

            <div>
                <h3>Ulubione produkty</h3>
            </div>

        </div>
    );
};

export default ClientPanel;