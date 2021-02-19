import React from "react";
import { Link } from "react-router-dom";

// For some reason, react-bootstrap does not seem to have a page footer
function Footer() {
  return (
    <div
      style={{
        paddingTop: "3rem",
        paddingBottom: "5rem",
        backgroundColor: "lightgray",
      }}
    >
      <footer className="navbar-fixed-bottom">
        <div className="container fluid">
          <div className="row justify-content-around">
            <Link to="/">Home</Link>
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/about">About</Link>
            <a href="#">Source Code</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
