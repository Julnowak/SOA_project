import React, {SyntheticEvent, useState} from 'react';
import {Navigate} from "react-router-dom";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

const Homepage = () => {
    document.body.style.backgroundColor = '#767676';

    const [currentUser, setCurrentUser] = useState();
    const [registrationToggle, setRegistration] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('producent');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e: SyntheticEvent) => {
      e.preventDefault();

      await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              email,
              password
          })
      });

      console.log(password)
      console.log(email)
      console.log(usertype)
      setRedirect(true);
    };


    if (redirect){
        if(usertype === "producent"){
            return <Navigate to={'/admin/products'}/>
        }
        return <Navigate to={'/'}/>
    }

    return (
        <div>
            <h1>HOME</h1>
        </div>
    );
};

export default Homepage;