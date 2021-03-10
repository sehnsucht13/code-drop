import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

import { Link, useHistory } from "react-router-dom";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

function FilterListItem({
  title,
  language,
  id,
  creatorId,
  isAuth,
  currentUser,
  refresh,
  key,
}) {
  const [isUserAuth, setIsUserAuth] = useState(isAuth);
  const history = useHistory();

  useEffect(() => {
    setIsUserAuth(isAuth);
  }, [isAuth]);

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
    <ListGroup.Item key={key}>
      <Row className="justify-content-between">
        <Col xs={8}>
          <Link to={{ pathname: "/view", search: `?id=${id}` }}>
            <p className="h5">{title}</p>
            <p className="text-muted" style={{ marginBottom: "0" }}>
              {language}
            </p>
          </Link>
        </Col>
        {isUserAuth && currentUser && creatorId === currentUser.uid && (
          <Col xs={4}>
            <Row className="justify-content-end">
              <Button style={{ marginRight: "0.5rem" }} onClick={handleEdit}>
                <p style={{ marginBottom: "0" }} className="d-none d-md-block">
                  Edit
                </p>
                <AiFillEdit className="d-md-none" />
              </Button>
              <Button onClick={handleDelete}>
                <p style={{ marginBottom: "0" }} className="d-none d-md-block">
                  Delete
                </p>
                <AiFillDelete className="d-md-none" />
              </Button>
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
