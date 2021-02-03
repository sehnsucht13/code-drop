import React, { useState } from "react";
import { connect } from "react-redux";
import NavBar from "../NavBar/Navbar";
import { Container, Form, Button, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
const axios = require("axios");

export const RegisterContainer = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const history = useHistory();

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  const handleConfirmPassword = (ev) => {
    setConfirmPassword(ev.target.value);
  };

  const handleUsername = (ev) => {
    setUserName(ev.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsValidated(true);
      axios
        .post("/register", { username: userName, password: password })
        .then((response) => {
          console.log("Response from server", response, response.status);
          if (response.status === 200 && response.data.status === "OK") {
            console.log("GOT AN OK");
            history.push("/login");
          } else if (
            response.status === 200 &&
            response.data.status === "ERROR"
          ) {
            //history.push("/");
            // TODO: Show user error that the username is taken
          }
        })
        .catch((err) => {
          console.log("Err from server", err);
          //setLoginError(true);
        });
    }
  };

  return (
    <div>
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <Form
          noValidate
          validated={isValidated}
          onSubmit={(e) => {
            console.log("Handled submit", e);
            handleSubmit(e);
          }}
          className="d-flex flex-column align-items-center"
        >
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              minLength="1"
              placeholder="Username"
              onChange={handleUsername}
              value={userName}
              name="username"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a username!
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              minLength="1"
              onChange={handlePassword}
              value={password}
              name="password"
              required
            />
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              minLength="1"
              onChange={handleConfirmPassword}
              value={confirmPassword}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password!
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign In
          </Button>
        </Form>
        <hr />
        <Row className="d-flex flex-column align-items-center">
          Already have an account?
          <Link to="/login">Click here to log in</Link>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
