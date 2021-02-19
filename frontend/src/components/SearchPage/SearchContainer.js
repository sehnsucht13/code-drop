import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/Navbar";
import DropsList from "../DropsList";
import SearchResults from "./SearchResults";
import { useLocation, Link } from "react-router-dom";
import { Container, Button, Row } from "react-bootstrap";
import queryString from "query-string";
import axios from "axios";

import SearchBar from "./SearchBar";

function SearchContainer() {
  let queryParams = queryString.parse(useLocation().search);
  console.log("got query params", queryParams);
  return (
    <div>
      <NavBar />
      <Container fluid>
        <SearchBar />
        <SearchResults searchParams={queryParams} />
      </Container>
    </div>
  );
}

export default SearchContainer;
