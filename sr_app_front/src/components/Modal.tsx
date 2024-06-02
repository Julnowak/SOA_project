import React, {useState} from 'react';
import {Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./Modal.css"

const Modal = () => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
    console.log(modal)
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <div>
      <Button variant="dark" onClick={toggleModal}>Zaproponuj</Button>

      {modal ? (
        <div style={{overflow: "hidden"}}>
            <div onClick={toggleModal} className="overlay"></div>

              <div className="modal-content" style={{backgroundColor: "white"}}>
                <Form>
                      <h2> Nowa cena</h2>
                      <Form.Control style={{marginTop:40, borderColor: "black", marginRight: 20}}
                        type="number"
                        min="0"
                        step=".01"

                      />
                      <Button style={{margin:20, marginRight: 20}}  variant="dark" type="submit">Zaakceptuj</Button>
                  </Form>
                <Button className="close-modal" variant="red" onClick={toggleModal}>
                  ❌
                </Button>
              </div>

        </div>
      ): null}
    </div>

  );
}

export default Modal;