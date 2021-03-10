import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import queryString from "query-string";

import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useHistory, Link, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/Navbar";

import { set_auth, checked_auth } from "../../actions/auth_actions";

export const LoginContainer = ({
  isAuth,
  hasChecked,
  checked_auth,
  set_auth,
}) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const history = useHistory();
  const queryParams = queryString.parse(useLocation().search);

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
  };

  const handleUsername = (ev) => {
    setUserName(ev.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      axios
        .post("/auth/login", {
          username: userName,
          password: password,
        })
        .then((response) => {
          if (response.status === 200) {
            if (isAuth) {
              axios
                .get("/auth/logout")
                .then((resp) => {
                  if (resp.status === 200) {
                    set_auth(false, undefined);
                    checked_auth(false);
                    if (queryParams && queryParams.redirect !== undefined) {
                      history.push(queryParams.redirect);
                    } else {
                      history.push("/");
                    }
                  }
                })
                .catch((err) => {
                  console.error("Error logging out");
                });
            } else {
              checked_auth(false);
              if (queryParams && queryParams.redirect !== undefined) {
                history.push(queryParams.redirect);
              } else {
                history.push("/");
              }
            }
          }
        })
        .catch((err) => {
          console.error("Error from server while loggin in", err);
          setLoginError(true);
        });
    }
  };

  return (
    <>
      <NavBar />
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        fluid
        style={{ minHeight: "80%", paddingBottom: "10%", paddingTop: "10%" }}
      >
        {loginError && (
          <Alert variant="danger">Error logging in. Please try again.</Alert>
        )}
        <Row>
          <Form
            noValidate
            validated={isValidated}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                minLength="1"
                maxLength="20"
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
        <Row
          className="d-flex flex-column align-items-center"
          style={{ paddingTop: "1em" }}
        >
          Don't have an account?
          <Link
            to={{
              pathname: "/register",
              search: queryParams.redirect
                ? `redirect=${queryParams.redirect}`
                : "",
            }}
          >
            Click here to create one
          </Link>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  hasChecked: state.auth.hasCheckedAuth,
});

const mapDispatchToProps = {
  checked_auth,
  set_auth,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
