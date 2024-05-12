import React from 'react';

const ClientPanel = () => {
    return (
        <div>
            <h1>Panel klienta</h1>
            <h3>Witaj, {localStorage.getItem('username')}!</h3>
        </div>
    );
};

export default ClientPanel;