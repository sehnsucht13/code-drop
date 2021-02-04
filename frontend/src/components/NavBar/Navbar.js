import React, { useState, useEffect } from "react";
import { Navbar, Form, Button, FormControl, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { set_auth, checked_auth, logout } from "../../actions/auth_actions";
const axios = require("axios");

// Source for combining react-router-dom with react-bootstrap
// https://stackoverflow.com/questions/54843302/reactjs-bootstrap-navbar-and-routing-not-working-together

function NavigationBar({ isAuth, hasChecked, set_auth, checked_auth, logout }) {
  const [searchInput, setSearchInput] = useState("");

  // Run before mounting
  useEffect(() => {
    if (!hasChecked) {
      axios
        .get("/user")
        .then((response) => {
          checked_auth(true);
          if (response.data === "") {
            set_auth(false, undefined);
          } else {
            set_auth(true, response.data.username);
          }
        })
        .catch();
    }
  }, []);

  // Change state if user logs out
  useEffect(() => {
    if (!hasChecked) {
      axios
        .get("/user")
        .then((response) => {
          checked_auth(true);
          if (response.data === "") {
            set_auth(false, undefined);
          } else {
            set_auth(true, response.data.username);
          }
        })
        .catch();
    }
  }, [isAuth, hasChecked]);

  const handleSearchInput = (ev) => {
    setSearchInput(ev.target.value);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Code-Drop
      </Navbar.Brand>
      <Form inline>
        <FormControl
          type="text"
          placeholder="Search..."
          className=" mr-sm-2"
          value={searchInput}
          onChange={handleSearchInput}
        />
        <Link to={{ pathname: "/search", search: `?contains=${searchInput}` }}>
          <Button>Search</Button>
        </Link>
      </Form>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/explore">
            Explore
          </Nav.Link>
          {isAuth && (
            <Nav.Link as={Link} to="/create">
              Create
            </Nav.Link>
          )}
          {isAuth && (
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
          )}
        </Nav>
        <Nav className="justify-content-end">
          {isAuth && (
            <Nav.Link
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Nav.Link>
          )}
          {!isAuth && hasChecked && (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          )}
          {!isAuth && hasChecked && (
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

const mapStateToProps = (state) => {
  console.log("State from navbar is", state);
  return {
    isAuth: state.auth.isAuth,
    hasChecked: state.auth.hasCheckedAuth,
  };
};

const mapDispatchToProps = {
  set_auth,
  checked_auth,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
