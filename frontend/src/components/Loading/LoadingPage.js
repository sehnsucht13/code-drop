import React from "react";
import { Spinner, Container } from "react-bootstrap";

function LoadingPage() {
  return (
    <div className="d-flex flex-column align-items-center h-100">
      <Spinner animation="grow"></Spinner>
      <span className="display-4">Loading...</span>
    </div>
  );
}

export default LoadingPage;
