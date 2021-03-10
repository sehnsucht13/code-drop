import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { BsStar, BsStarFill } from "react-icons/bs";
import { BiGitRepoForked } from "react-icons/bi";

function StarAndFork({
  id,
  hasStar,
  starCount,
  className,
  forkCount,
  isAuth,
  removeMargin,
}) {
  const [isStarred, setIsStarred] = useState(hasStar);
  const [numStars, setNumStars] = useState(starCount);
  const [isUserAuth, setIsUserAuth] = useState(isAuth);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setIsUserAuth(isAuth);
  }, [isAuth]);

  const handleStarClick = () => {
    if (isStarred && isUserAuth) {
      axios
        .delete(`drop/${id}/stars`)
        .then((response) => {
          if (response.status === 200) {
            setIsStarred(false);
            setNumStars(numStars - 1);
          }
        })
        .catch((err) => {
          console.error("got an error", err);
        });
    } else {
      if (isUserAuth) {
        axios
          .post(`drop/${id}/stars`)
          .then((response) => {
            if (response.status === 200) {
              setIsStarred(true);
              setNumStars(numStars + 1);
            }
          })
          .catch((err) => {
            console.error("got an error", err.response);
          });
      } else {
        location.pathname === "/view"
          ? history.push(
              `/login?redirect=${location.pathname}${location.search}`
            )
          : history.push("/login");
      }
    }
  };

  const handleFork = () => {
    if (isUserAuth) {
      history.push(`/edit?id=${id}&fork=t`);
    } else {
      location.pathname === "/view"
        ? history.push(`/login?redirect=${location.pathname}${location.search}`)
        : history.push("/login");
    }
  };

  return (
    <div className={className}>
      <Row className="justify-content-end">
        <ButtonGroup
          style={{
            paddingRight: "0.5rem",
            paddingBottom: "0rem",
            marginTop: "0.5rem",
            marginBottom: removeMargin ? "0rem" : "1rem",
            maxHeight: "2rem",
          }}
        >
          <Button
            onClick={handleStarClick}
            style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
            className="d-flex justify-content-center align-items-center"
          >
            {isStarred && isUserAuth ? (
              <>
                <BsStarFill />
                <p
                  className="d-none d-lg-block"
                  style={{ marginBottom: "0rem" }}
                >
                  Unstar
                </p>
              </>
            ) : (
              <>
                <BsStar />
                <p
                  className="d-none d-lg-block"
                  style={{ marginBottom: "0rem", marginLeft: "0.2rem" }}
                >
                  Star
                </p>
              </>
            )}
          </Button>
          <Button variant="light" disabled style={{}}>
            {numStars}
          </Button>
          <Button
            style={{}}
            className="d-flex justify-content-center align-items-center"
            onClick={handleFork}
          >
            <BiGitRepoForked />
            <p
              className="d-none d-lg-block"
              style={{ marginBottom: "0rem", marginLeft: "0.2rem" }}
            >
              Fork
            </p>
          </Button>
          <Button variant="light" disabled style={{}}>
            {forkCount}
          </Button>
        </ButtonGroup>
      </Row>
    </div>
  );
}

// export default StarAndFork;
const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(StarAndFork);
