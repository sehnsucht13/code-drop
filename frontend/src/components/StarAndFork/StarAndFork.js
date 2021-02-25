import React, { useState } from "react";
import { connect } from "react-redux";
import { BsStar, BsStarFill } from "react-icons/bs";
import { BiGitRepoForked } from "react-icons/bi";
import { Row, Button, ButtonGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";

function StarAndFork({ id, hasStar, starCount, className, forkCount, isAuth }) {
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
        .catch((err) => {});
    } else {
      if (isAuth) {
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
            // if (err.response.status === 401) {
            //   // Reroute to login page here
            //   history.push("/login");
            // }
          });
      } else {
        history.push("/login");
      }
    }
  };

  const handleFork = () => {
    if (isAuth) {
      history.push(`/edit?id=${id}&fork=t`);
    } else {
      history.push("/login");
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
            marginBottom: "1rem",
            maxHeight: "2rem",
          }}
        >
          <Button
            onClick={handleStarClick}
            style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
            className="d-flex justify-content-center align-items-center"
          >
            {isStarred ? (
              <>
                <BsStarFill />
                <p className="d-none d-lg-block">Unstar</p>
              </>
            ) : (
              <>
                <BsStar />
                <p className="d-none d-lg-block">Star</p>
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
            <p className="d-none d-lg-block">Fork</p>
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
