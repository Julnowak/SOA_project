import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Base_nav() {
  return (

    <Navbar bg="primary" data-bs-theme="dark" expand="lg" className="bg-body-tertiary" >
      <Container>
        <Navbar.Brand href="http://localhost:3000/">HOME</Navbar.Brand>
        <Navbar.Brand href="http://localhost:3000/admin/products">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person"
               viewBox="0 0 16 16">
            <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          </svg>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="http://localhost:3000/products_view">Market</Nav.Link>
            <Nav.Link href="#link">Negocjacje</Nav.Link>
            <Nav.Link href="#link">Historia</Nav.Link>
            {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
            {/*  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
            {/*  <NavDropdown.Item href="#action/3.2">*/}
            {/*    Another action*/}
            {/*  </NavDropdown.Item>*/}
            {/*  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
            {/*  <NavDropdown.Divider />*/}
            {/*  <NavDropdown.Item href="#action/3.4">*/}
            {/*    Separated link*/}
            {/*  </NavDropdown.Item>*/}
            {/*</NavDropdown>*/}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Base_nav;