import React, { useState } from "react";
import { connect } from "react-redux";
import NavBar from "../NavBar/Navbar";
import { Container, Form, Button, Row } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
const axios = require("axios");

export const LoginContainer = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const history = useHistory();

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
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
        .post("/login", { username: userName, password: password })
        .then((response) => {
          console.log("Response from server", response, response.status);
          if (response.status === 200) {
            console.log("redirect");
            setLoginError(false);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log("Err from server", err);
          setLoginError(true);
        });
    }
  };

  return (
    <div>
      <Container className="d-flex flex-column justify-content-center align-items-center">
        <Row>{loginError && <p>Error logging in</p>}</Row>
        <Row>
          <Form
            noValidate
            validated={isValidated}
            onSubmit={(e) => {
              console.log("Handled submit", e);
              handleSubmit(e);
            }}
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
              <Form.Control.Feedback type="invalid">
                Please provide a password!
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="justify-content-center">
              <Button variant="primary" type="submit">
                Sign In
              </Button>
            </Row>
          </Form>
        </Row>
        <Row className="d-flex flex-column align-items-center">
          Don't have an account?
          <Link to="/register">Click here to create one</Link>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
