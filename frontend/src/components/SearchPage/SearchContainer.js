import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/Navbar";
import { useLocation, Link } from "react-router-dom";
import { Container, Form, Col, Button } from "react-bootstrap";
import queryString from "query-string";
import axios from "axios";

import SearchBar from "./SearchBar";

function SearchContainer() {
  // Stores the parsed query string parameters whenever the component is rendered again.
  let searchParams = queryString.parse(useLocation().search);
  console.log("The page params are ", searchParams);

  // React.useEffect(() => {
  //   axios
  //     .get("/drops/search", { params: { ...searchParams } })
  //     .then((response) => {
  //       console.log("Response from server is", response.data);
  //     });
  // }, [searchParams]);

  return (
    <div>
      <NavBar />
      <Container fluid>
        <SearchBar />
      </Container>
    </div>
  );
}

export default SearchContainer;
