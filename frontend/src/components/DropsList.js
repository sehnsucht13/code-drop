import {
  Card,
  Row,
  Button,
  InputGroup,
  FormControl,
  ButtonGroup,
} from "react-bootstrap";
import { BiStar, BiGitRepoForked } from "react-icons/bi";
import { Link } from "react-router-dom";

import React from "react";

function formatDate(timestamp) {
  const parsedDate = Date.parse(timestamp);
  console.log(parsedDate.toString());
}
function DropsList({ drops }) {
  return (
    <div className="code-drops-display">
      {drops.map((drop) => (
        <Card key={drop.id} style={{ marginTop: "1rem", paddingBottom: "0" }}>
          <Card.Body>
            <Row
              className="justify-content-end"
              style={{ marginBottom: "0.5rem" }}
            >
              <ButtonGroup
                style={{
                  paddingRight: "0.5rem",
                }}
              >
                <Button>Star</Button>
                <Button
                  variant="light"
                  disabled
                  style={{ paddingLeft: "0.5rem", marginLeft: "0" }}
                >
                  44
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button>Fork</Button>
                <Button
                  variant="light"
                  disabled
                  style={{ paddingLeft: "0.5rem", marginLeft: "0" }}
                >
                  44
                </Button>
              </ButtonGroup>
            </Row>
            <Link
              to={{ pathname: "/view", search: `?id=${drop.id}` }}
              style={{ textDecoration: "none" }}
            >
              <Card.Title className="mb-3">{drop.title}</Card.Title>
              <Card.Subtitle className="">
                {drop.description}
                <div className="mb-1 text-muted">{drop.lang}</div>
                <div className="mb-1 text-muted">
                  Last Activity: {drop.updatedAt}
                </div>
              </Card.Subtitle>
            </Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default DropsList;
