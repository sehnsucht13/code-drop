import { ListGroup, Card } from "react-bootstrap";

import React from "react";

function DropsList({ drops }) {
  return (
    <div className="code-drops-display">
      {drops.map((drop) => (
        <Card key={drop.id} style={{ marginBottom: "1%" }}>
          <Card.Body>
            <Card.Title>{drop.dropTitle}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {drop.dropLanguage}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default DropsList;
