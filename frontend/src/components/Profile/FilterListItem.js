import React from "react";
import { Col, Row, ListGroupItem, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
const axios = require("axios");

function FilterListItem({ title, language, id }) {
  const handleDelete = () => {
    axios
      .delete(`/drop/${id}`)
      .then((response) => {})
      .catch();
  };
  const handleEdit = () => {};
  return (
    <ListGroupItem>
      <Row className="justify-content-between">
        <Col xs={8}>
          <Link>
            <p className="h5">{title}</p>
            <p className="text-muted">{language}</p>
          </Link>
        </Col>
        <Col xs={4}>
          <Button style={{ marginRight: "1rem" }}>Edit</Button>
          <Button>Delete</Button>
        </Col>
      </Row>
    </ListGroupItem>
  );
}

export default FilterListItem;
