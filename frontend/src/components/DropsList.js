import { Card, Row, Button } from "react-bootstrap";
import { BiStar, BiGitRepoForked } from "react-icons/bi";

import React from "react";

function formatDate(timestamp) {
  const parsedDate = Date.parse(timestamp);
  console.log(parsedDate.toString());
}
function DropsList({ drops }) {
  return (
    <div className="code-drops-display">
      {drops.map((drop) => (
        <a
          style={{ cursor: "pointer" }}
          onClick={() => console.log("Hello world")}
        >
          <Card key={drop.id} style={{ marginBottom: "1%" }}>
            <Card.Body>
              <Row className="justify-content-end">
                <Button style={{ marginRight: "5px" }}>Star</Button>
                <Button>Fork</Button>
              </Row>
              <Card.Title>{drop.title}</Card.Title>
              <Card.Subtitle className="mb-1 ">
                {drop.description}
              </Card.Subtitle>
              <Card.Text className="d-flex justify-content-between">
                <div className="mb-1 text-muted">{drop.lang}</div>
                <div className="mb-1 text-muted">
                  <span>Stars: 44 </span>
                  <span>Forks: 33</span>
                </div>
              </Card.Text>
              <Row>
                <div className="mb-1 text-muted">
                  Last Activity: {drop.updatedAt}
                </div>
              </Row>
            </Card.Body>
          </Card>
        </a>
      ))}
    </div>
  );
}

export default DropsList;
