import React from "react";
import { Row, Jumbotron, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ErrorContainer() {
  return (
    <>
      <Container fluid style={{ height: "100%" }}>
        <Jumbotron fluid style={{ height: "100%" }}>
          <h1>There does not seem to be anything here :( !</h1>
          <Row className="justify-content-center">
            <Link to="/">
              <Button>Go to the main page</Button>
            </Link>
          </Row>
        </Jumbotron>
      </Container>
    </>
  );
}

export default ErrorContainer;
