import React, { useState, useEffect } from "react";
import { Navbar, Form, Button, FormControl, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { set_auth, checked_auth, logout } from "../../actions/auth_actions";
const axios = require("axios");

// Source for combining react-router-dom with react-bootstrap
// https://stackoverflow.com/questions/54843302/reactjs-bootstrap-navbar-and-routing-not-working-together

function NavigationBar({
  isAuth,
  hasChecked,
  set_auth,
  checked_auth,
  logout,
  user,
}) {
  const [searchInput, setSearchInput] = useState("");

  // Run before mounting
  useEffect(() => {
    if (!hasChecked) {
      axios
        .get("/auth/session")
        .then((response) => {
          console.log(
            "Got a response for auth",
            response,
            axios.defaults.baseURL
          );
          checked_auth(true);
          if (response.data === "") {
            set_auth(false, undefined);
          } else {
            set_auth(true, response.data);
          }
        })
        .catch((err) => {
          console.log("AUTH ERROR", err);
          // set_auth(false, undefined);
          // checked_auth(true);
        });
    }
  }, [set_auth, checked_auth, hasChecked]);

  // Change state if user logs out
  useEffect(() => {
    if (!hasChecked) {
      axios
        .get("/auth/session")
        .then((response) => {
          console.log(
            "Got a response for auth",
            response,
            axios.defaults.baseURL
          );
          checked_auth(true);
          if (response.data === "") {
            set_auth(false, undefined);
          } else {
            set_auth(true, response.data);
          }
        })
        .catch((err) => {
          console.log("AUTH ERROR", err);
          // set_auth(false, undefined);
          // checked_auth(true);
        });
    }
  }, [isAuth, hasChecked, set_auth, checked_auth]);

  const handleSearchInput = (ev) => {
    setSearchInput(ev.target.value);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        Code-Drop
      </Navbar.Brand>
      <Form inline className="d-none d-sm-block">
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
          <Nav.Link as={Link} to="/search" className="d-md-none">
            Search
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            Explore
          </Nav.Link>
          {isAuth && (
            <Nav.Link as={Link} to="/create">
              Create
            </Nav.Link>
          )}
          {isAuth && (
            <Nav.Link
              as={Link}
              to={{ pathname: "/profile", search: `?id=${user.uid}` }}
            >
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
  console.log("State from navbar", state);
  return {
    isAuth: state.auth.isAuth,
    user: state.auth.user,
    hasChecked: state.auth.hasCheckedAuth,
  };
};

const mapDispatchToProps = {
  set_auth,
  checked_auth,
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
