import React from "react";

import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function LoadingPage() {
  return (
    <Container fluid style={{ height: "100%" }}>
      <Row
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: "100%" }}
      >
        <Spinner animation="grow"></Spinner>
        <p className="display-4" style={{ paddingTop: "0.2em" }}>
          Fetching Comments...
        </p>
      </Row>
    </Container>
  );
}

export default LoadingPage;
