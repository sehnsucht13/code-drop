import React from "react";
import { Link } from "react-router-dom";

// For some reason, react-bootstrap does not seem to have a page footer
function Footer() {
  return (
    <div
      style={{
        paddingTop: "2rem",
        paddingBottom: "3rem",
        backgroundColor: "#343a40",
      }}
    >
      <footer className="navbar-fixed-bottom">
        <div className="container fluid">
          <div className="row justify-content-around">
            <Link to="/">Home</Link>
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/about">About</Link>
            <a href="https://github.com/sehnsucht13/code-drop">Source Code</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
