import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

// For some reason, react-bootstrap does not seem to have a page footer
function Footer() {
  return (
    <footer
      className="navbar fixed-bottom"
      style={{
        paddingTop: "2rem",
        paddingBottom: "3rem",
        backgroundColor: "#343a40",
        position: "relative",
        minHeight: "15%",
      }}
    >
      <Container fluid>
        <Row className="justify-content-around" style={{ width: "100%" }}>
          <Link to="/" style={{ color: "white" }}>
            Home
          </Link>
          <Link to="/login" style={{ color: "white" }}>
            Log In
          </Link>
          <Link to="/register" style={{ color: "white" }}>
            Sign Up
          </Link>
          <Link to="/about" style={{ color: "white" }}>
            About
          </Link>
          <a
            href="https://github.com/sehnsucht13/code-drop"
            style={{ color: "white" }}
          >
            Source Code
          </a>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
