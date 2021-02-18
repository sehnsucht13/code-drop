import { Card, Row, Button, ButtonGroup } from "react-bootstrap";
import { BiGitRepoForked } from "react-icons/bi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";

const axios = require("axios");

function DropItem({
  id,
  title,
  language,
  lastUpdate,
  description,
  hasStar,
  starCount,
}) {
  const [isStarred, setIsStarred] = useState(hasStar);
  const [numStars, setNumStars] = useState(starCount);
  const history = useHistory();
  console.log("Id is ", id, hasStar);

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
    <Card key={id} style={{ marginTop: "1rem", paddingBottom: "0" }}>
      <Card.Body>
        <Row className="justify-content-end" style={{ marginBottom: "0.5rem" }}>
          <ButtonGroup
            style={{
              paddingRight: "0.5rem",
            }}
          >
            <Button onClick={handleStarClick}>
              {isStarred ? (
                <>
                  <BsStarFill style={{ marginRight: "0.5rem" }} />
                  Unstar
                </>
              ) : (
                <>
                  <BsStar style={{ marginRight: "0.5rem" }} />
                  Star
                </>
              )}
            </Button>
            <Button
              variant="light"
              disabled
              style={{ paddingLeft: "0.5rem", marginLeft: "0" }}
            >
              {numStars}
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button>
              <BiGitRepoForked style={{ marginRight: "0.5rem" }} />
              Fork
            </Button>
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
          to={{ pathname: "/view", search: `?id=${id}` }}
          style={{ textDecoration: "none" }}
        >
          <Card.Title className="mb-3">{title}</Card.Title>
          <Card.Subtitle className="">
            {description}
            <div className="mb-1 text-muted">{language}</div>
            <div className="mb-1 text-muted">Last Activity: {lastUpdate}</div>
          </Card.Subtitle>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default DropItem;
