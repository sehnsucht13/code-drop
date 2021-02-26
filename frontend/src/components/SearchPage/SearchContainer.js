import React from "react";
import NavBar from "../NavBar/Navbar";
import SearchResults from "./SearchResults";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import queryString from "query-string";

import SearchBar from "./SearchBar";
import Footer from "../Footer/Footer";

function SearchContainer() {
  let queryParams = queryString.parse(useLocation().search);
  console.log("got query params", queryParams);
  return (
    <div style={{ height: "100%" }}>
      <NavBar />
      <Container fluid style={{ minHeight: "100%" }}>
        <SearchBar searchInput={queryParams.contains} />
        <SearchResults searchParams={queryParams} />
      </Container>
      <Footer />
    </div>
  );
}

export default SearchContainer;
