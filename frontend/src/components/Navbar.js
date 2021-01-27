import React from "react";
import { Navbar, Form, Button, FormControl, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

// Source for combining react-router-dom with react-bootstrap
// https://stackoverflow.com/questions/54843302/reactjs-bootstrap-navbar-and-routing-not-working-together

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Code-Drop
      </Navbar.Brand>
      <Form inline>
        <FormControl type="text" placeholder="Search" className=" mr-sm-2" />
        <Button type="submit">Search</Button>
      </Form>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/explore">
            Explore
          </Nav.Link>
          <Nav.Link as={Link} to="/new">
            Create
          </Nav.Link>
          <Nav.Link as={Link} to="/profile">
            Profile
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
