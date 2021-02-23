import React from "react";
import { Row, Jumbotron, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ErrorContainer({ type }) {
  return (
    <Container fluid style={{ height: "100%" }}>
      <Jumbotron fluid style={{ height: "100%" }}>
        {type === undefined || type === "nothing" ? (
          <h1 className="text-center">
            There does not seem to be anything here :( !
          </h1>
        ) : (
          <h1 className="text-center">This profile does not exist!</h1>
        )}
        <Row className="justify-content-center">
          <Link to="/">
            <Button>Go to the main page</Button>
          </Link>
        </Row>
      </Jumbotron>
    </Container>
  );
}

export default ErrorContainer;
