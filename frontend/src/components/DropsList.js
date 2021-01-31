import { ListGroup, Card } from "react-bootstrap";

import React from "react";

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
              <Card.Title>{drop.dropTitle}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {drop.dropLanguage}
              </Card.Subtitle>
              <Card.Body>
                <div>Here is the summary</div>
                <div className="mb-2 text-muted">Last Activity: Today</div>
              </Card.Body>
            </Card.Body>
          </Card>
        </a>
      ))}
    </div>
  );
}

export default DropsList;
