import React from 'react';
import './App.css';
import Nav from "./components/Nav";
import Products from "./admin/Products";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./components/Main";


function App() {
  return (
    <div className="App">
        <Nav />

        <div className="container-fluid">
            <div className="row">
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<Main/>}/>
                            <Route path='/admin/products' element={<Products/>}/>
                        </Routes>
                    </BrowserRouter>

                </main>
            </div>
        </div>
    </div>
  );
}

export default App;
