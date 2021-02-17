import React from "react";
import { Spinner, Container, Row } from "react-bootstrap";

function LoadingPage() {
  return (
    <Container fluid style={{ height: "100%" }}>
      <Row
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: "100%" }}
      >
        <Spinner animation="grow"></Spinner>
        <p className="display-4" style={{ paddingTop: "0.2em" }}>
          Loading...
        </p>
      </Row>
    </Container>
  );
}

export default LoadingPage;
