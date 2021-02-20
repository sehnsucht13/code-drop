import { Card, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { BiGitRepoForked } from "react-icons/bi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";

const axios = require("axios");

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
  let [month, day, year] = new Date(lastUpdate)
    .toLocaleDateString("en-US")
    .split("/");
  console.log(month, day, year);

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
          <Col style={{ paddingLeft: "1rem" }}>
            <span
              className="font-weight-bold text-center"
              style={{ fontSize: "1.5rem" }}
            >
              {user.username}
            </span>
            <br />
            <span classNae="font-weight-light">
              {`${monthNames[month - 1]} ${day}, ${year}`}
            </span>
          </Col>
          <Col sm={3} className="d-flex flex-row justify-content-end">
            <ButtonGroup
              style={{
                paddingRight: "0.5rem",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Button
                onClick={handleStarClick}
                style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
              >
                {isStarred ? (
                  <>
                    <BsStarFill style={{ marginRight: "0.5rem" }} />
                    Unstar
                  </>
                ) : (
                  <>
                    <BsStar
                      style={{ marginLeft: "0", marginRight: "0.5rem" }}
                    />
                    Star
                  </>
                )}
              </Button>
              <Button variant="light" disabled style={{}}>
                {numStars}
              </Button>
              <Button style={{}}>
                <BiGitRepoForked />
                Fork
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
