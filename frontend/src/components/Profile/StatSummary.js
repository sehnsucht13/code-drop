import React from "react";
import { Row } from "react-bootstrap";

function StatSummary({ numStars, numForks }) {
  return (
    <Row className="justify-content-around">
      <p className="h4">Stars: {numStars}</p>
      <p className="h4">Forks: {numForks}</p>
    </Row>
  );
}

export default StatSummary;
