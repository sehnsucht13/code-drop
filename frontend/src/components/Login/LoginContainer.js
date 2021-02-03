import React, { useState } from "react";
import { connect } from "react-redux";
import NavBar from "../NavBar/Navbar";
import { Container, Form, Button } from "react-bootstrap";

export const LoginContainer = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  const handleUsername = (ev) => {
    setUserName(ev.target.value);
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setIsValidated(true);
  };

  return (
    <div>
      <Container className="d-flex justify-content-center align-items-center">
        <Form
          noValidate
          validated={isValidated}
          onSubmit={handleSubmit}
          action="login"
          method="POST"
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
          <Button variant="primary" type="submit">
            Sign In
          </Button>
        </Form>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
