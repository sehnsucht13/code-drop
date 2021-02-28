import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import StarAndFork from "../StarAndFork/StarAndFork";
import formatDate from "../../helpers/DateFormat";

function DropItem({
  id,
  title,
  language,
  lastUpdate,
  description,
  hasStar,
  starCount,
  user,
  forkCount,
}) {
  return (
    <Card key={id} style={{ marginTop: "0.5rem", paddingBottom: "0" }}>
      <Card.Body style={{ paddingTop: "0.5rem" }}>
        <StarAndFork
          id={id}
          hasStar={hasStar}
          starCount={starCount}
          forkCount={forkCount}
          className="d-md-none"
        />
        <Row
          className="justify-content-between"
          style={{ marginBottom: "0rem", paddingTop: "0rem" }}
        >
          <Col
            style={{
              paddingLeft: "1rem",
              marginBottom: "0",
              paddingBottom: "0",
            }}
            xs={12}
            md={8}
          >
            <Link
              to={{ pathname: "/profile", search: `?id=${user.id}` }}
              style={{ color: "black" }}
            >
              <p
                className="text-left"
                style={{
                  fontSize: "1.5rem",
                  paddingBottom: "0",
                  marginBottom: "0",
                }}
              >
                {user.username}
              </p>
            </Link>
            <p
              className="font-weight-light"
              style={{ paddingBottom: "0", marginBottom: "0" }}
            >
              {formatDate(lastUpdate)}
            </p>
          </Col>
          <Col md={4} className="d-none d-md-block">
            <StarAndFork
              id={id}
              hasStar={hasStar}
              starCount={starCount}
              forkCount={forkCount}
              className="d-none d-md-block"
            />
          </Col>
        </Row>
        <Link
          to={{ pathname: "/view", search: `?id=${id}` }}
          style={{ textDecoration: "none" }}
        >
          <Card.Title className="mb-3">{title}</Card.Title>
          <Card.Subtitle className="">
            {description}
            <div className="mb-1 text-muted">{language}</div>
          </Card.Subtitle>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default DropItem;
