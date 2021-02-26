import React, { useState } from "react";
import { connect } from "react-redux";
import NavBar from "../NavBar/Navbar";
import { Container, Form, Button, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Footer from "../Footer/Footer";
const axios = require("axios");

const PASSWORD_NO_MATCH_ERR = "Passwords do not match!";
const PASSWORD_EMPTY_ERR = "Please enter a password!";
const USERNAME_TAKEN_ERR = "Username is already taken!";
const USERNAME_EMPTY_ERR = "Please enter a username!";

export const RegisterContainer = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Form Fields validation status
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = useState(
    false
  );
  // Form fields error strings
  const [confirmPasswordErrString, setConfirmPasswordErrString] = useState(
    PASSWORD_EMPTY_ERR
  );
  const [passwordErrString, setPasswordErrString] = useState(
    PASSWORD_EMPTY_ERR
  );
  const [usernameErrString, setUsernameErrString] = useState(
    USERNAME_EMPTY_ERR
  );

  const history = useHistory();

  const handlePassword = (ev) => {
    const passwordValue = ev.target.value;
    if (passwordValue !== confirmPassword && confirmPassword.length > 0) {
      setPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setConfirmPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setIsPasswordInvalid(true);
      setIsConfirmPasswordInvalid(true);
    } else {
      setIsPasswordInvalid(false);
      setIsConfirmPasswordInvalid(false);
    }
    setPassword(passwordValue);
  };

  const handleConfirmPassword = (ev) => {
    const confirmPasswordValue = ev.target.value;
    if (confirmPasswordValue !== password && password.length > 0) {
      setPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setConfirmPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setIsPasswordInvalid(true);
      setIsConfirmPasswordInvalid(true);
    } else {
      setIsPasswordInvalid(false);
      setIsConfirmPasswordInvalid(false);
    }
    setConfirmPassword(confirmPasswordValue);
  };

  const handleUsername = (ev) => {
    setUserName(ev.target.value);
  };

  const validateFormFields = () => {
    if (userName.length === 0) {
      setUsernameErrString(USERNAME_EMPTY_ERR);
      setIsUsernameInvalid(true);
    }

    if (password !== confirmPassword) {
      setPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setConfirmPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setIsPasswordInvalid(true);
      setIsConfirmPasswordInvalid(true);
      return false;
    }

    if (password.length === 0) {
      setPasswordErrString(PASSWORD_EMPTY_ERR);
      setIsPasswordInvalid(true);
      return false;
    }
    if (confirmPassword.length === 0) {
      setConfirmPasswordErrString(PASSWORD_EMPTY_ERR);
      setIsConfirmPasswordInvalid(true);
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (userName.length === 0) {
      setUsernameErrString(USERNAME_EMPTY_ERR);
      setIsUsernameInvalid(true);
      return;
    } else if (!isPasswordInvalid) {
      setPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setConfirmPasswordErrString(PASSWORD_NO_MATCH_ERR);
      setIsPasswordInvalid(true);
      setIsConfirmPasswordInvalid(true);
    }

    if (validateFormFields() === true) {
      setIsUsernameInvalid(false);
      setIsPasswordInvalid(false);
      setIsConfirmPasswordInvalid(false);

      axios
        .post("/auth/register", { username: userName, password: password })
        .then((response) => {
          if (response.status === 200 && response.data.status === "OK") {
            history.push("/login");
          } else if (
            response.status === 200 &&
            response.data.status === "TAKEN"
          ) {
            setUsernameErrString(USERNAME_TAKEN_ERR);
            setIsUsernameInvalid(true);
          }
        })
        .catch((err) => {
          console.log("Err from server", err);
        });
    }
  };

  return (
    <>
      <NavBar />
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        fluid
        style={{ height: "100%", paddingBottom: "10%" }}
      >
        <Form
          noValidate
          onSubmit={handleSubmit}
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
              isInvalid={isUsernameInvalid}
            />
            <Form.Control.Feedback type="invalid">
              {usernameErrString}
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
              isInvalid={isPasswordInvalid}
            />
            <Form.Control.Feedback type="invalid">
              {passwordErrString}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              minLength="1"
              onChange={handleConfirmPassword}
              value={confirmPassword}
              isInvalid={isConfirmPasswordInvalid}
            />
            <Form.Control.Feedback type="invalid">
              {confirmPasswordErrString}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <Row
          className="d-flex flex-column align-items-center"
          style={{ paddingTop: "1em" }}
        >
          Already have an account?
          <Link to="/login">Click here to log in</Link>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
