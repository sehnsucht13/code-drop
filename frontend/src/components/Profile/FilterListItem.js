import React from "react";
import { connect } from "react-redux";
import { Col, Row, ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
const axios = require("axios");

function FilterListItem({ title, language, id, isAuth }) {
  // TODO: Handle Deleting
  const handleDelete = () => {
    axios
      .delete(`/drop/${id}`)
      .then((response) => {})
      .catch();
  };
  // TODO: Handle editing
  const handleEdit = () => {};

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
        {isAuth && (
          <Col xs={3}>
            <Row className="justify-content-end">
              <Button style={{ marginRight: "1rem" }}>Edit</Button>
              <Button>Delete</Button>
            </Row>
          </Col>
        )}
      </Row>
    </ListGroup.Item>
  );
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps)(FilterListItem);
