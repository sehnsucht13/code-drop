import { Card, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { BiGitRepoForked } from "react-icons/bi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";
import formatDate from "../../helpers/DateFormat";

const axios = require("axios");

function DropItem({
  id,
  title,
  language,
  lastUpdate,
  description,
  hasStar,
  starCount,
  user,
}) {
  const [isStarred, setIsStarred] = useState(hasStar);
  const [numStars, setNumStars] = useState(starCount);
  const history = useHistory();

  const handleStarClick = () => {
    if (isStarred) {
      axios
        .delete(`drop/${id}/stars`)
        .then((response) => {
          if (response.status === 200) {
            setIsStarred(false);
            setNumStars(numStars - 1);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            // Reroute to login page here
            history.push("/login");
          }
        });
    } else {
      axios
        .post(`drop/${id}/stars`)
        .then((response) => {
          if (response.status === 200) {
            setIsStarred(true);
            setNumStars(numStars + 1);
          }
        })
        .catch((err) => {
          console.log("got an error", err.response);
          if (err.response.status === 401) {
            // Reroute to login page here
            history.push("/login");
          }
        });
    }
  };

  return (
    <Card key={id} style={{ marginTop: "0.5rem", paddingBottom: "0" }}>
      <Card.Body style={{ paddingTop: "0.5rem" }}>
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
          <Col sm={2} md={4} className="d-flex flex-row justify-content-end">
            <ButtonGroup
              style={{
                paddingRight: "0.5rem",
                paddingBottom: "0rem",
                marginTop: "0.5rem",
                marginBottom: "1rem",
                maxHeight: "2rem",
              }}
            >
              <Button
                onClick={handleStarClick}
                style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
              >
                {isStarred ? (
                  <>
                    <BsStarFill style={{ marginRight: "0.5rem" }} />
                    <p className="d-none d-md-block">Unstar</p>
                  </>
                ) : (
                  <>
                    <BsStar
                      style={{ marginLeft: "0", marginRight: "0.5rem" }}
                    />
                    <p className="d-none d-lg-block">Star</p>
                  </>
                )}
              </Button>
              <Button variant="light" disabled style={{}}>
                {numStars}
              </Button>
              <Button style={{}}>
                <BiGitRepoForked />
                <p className="d-none d-lg-block">Fork</p>
              </Button>
              <Button variant="light" disabled style={{}}>
                44
              </Button>
            </ButtonGroup>
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
