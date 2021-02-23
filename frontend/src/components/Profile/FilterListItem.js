import React from "react";
import { connect } from "react-redux";
import { Col, Row, ListGroup, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
const axios = require("axios");

function FilterListItem({
  title,
  language,
  id,
  creatorId,
  isAuth,
  currentUser,
  refresh,
}) {
  const history = useHistory();
  const handleDelete = () => {
    axios
      .delete(`/drop/${id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("got a 200 status code!");
          refresh(true);
        }
      })
      .catch((err) => {
        console.log("Error deleting!", err.response);
      });
  };

  const handleEdit = () => {
    history.push(`/edit?id=${id}`);
  };

  return (
    <ListGroup.Item>
      <Row className="justify-content-between">
        <Col xs={9}>
          <Link to={{ pathname: "/view", search: `?id=${id}` }}>
            <p className="h5">{title}</p>
            <p className="text-muted" style={{ marginBottom: "0" }}>
              {language}
            </p>
          </Link>
        </Col>
        {isAuth && currentUser && creatorId === currentUser.uid && (
          <Col xs={3}>
            <Row className="justify-content-end">
              <Button style={{ marginRight: "1rem" }} onClick={handleEdit}>
                Edit
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </Row>
          </Col>
        )}
      </Row>
    </ListGroup.Item>
  );
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  currentUser: state.auth.user,
});

export default connect(mapStateToProps)(FilterListItem);
