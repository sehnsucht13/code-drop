import React from "react";
import NavBar from "../NavBar/Navbar";
import SearchResults from "./SearchResults";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import queryString from "query-string";

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
