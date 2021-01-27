import React from "react";
import NavBar from "./Navbar";
import { Jumbotron, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ErrorContainer() {
  return (
    <>
      <NavBar />
      <Container fluid>
        <Jumbotron fluid>
          <h1>There does not seem to be anything here :( !</h1>
          <Link to="/">
            <Button>Go to the main page</Button>
          </Link>
        </Jumbotron>
      </Container>
    </>
  );
}

export default ErrorContainer;
