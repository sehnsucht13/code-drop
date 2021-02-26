import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, Tab, Container } from "react-bootstrap";
import axios from "axios";
import queryString from "query-string";

import NavBar from "../NavBar/Navbar";
import BlockCodeDisplay from "../BlockDisplay/BlockDisplay";
import InlineCodeDisplay from "../InlineDisplay/InlineDisplay";
import LoadingPage from "../Loading/LoadingPage";
import CommentContainer from "../CommentDisplay/CommentContainer";
import Footer from "../Footer/Footer";
import ErrorPage from "../Error/ErrorContainer";

// Add additional languages for display
// Src: https://github.com/FormidableLabs/prism-react-renderer#faq
import Prism from "prism-react-renderer/prism";
(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-java");
require("prismjs/components/prism-rust");
require("prismjs/components/prism-toml");
require("prismjs/components/prism-docker");
require("prismjs/components/prism-latex");
require("prismjs/components/prism-julia");
require("prismjs/components/prism-ocaml");

function CodeDisplayContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [codeDrop, setCodeDrop] = useState({});
  const [codeDropAnnotations, setcodeDropAnnotations] = useState([]);
  const [currentTab, setcurrentTab] = useState("block");
  const searchParams = queryString.parse(useLocation().search);

  const handleTabClick = (tabKey) => {
    setcurrentTab(tabKey);
  };

  // Load the data from the server
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/drop/${searchParams.id}`)
      .then((response) => {
        console.log(response.data);
        setCodeDrop(response.data.codeDrop);
        setcodeDropAnnotations(response.data.dropAnnotations);
        setIsLoading(false);
      })
      .catch((err) => {
        setHasError(true);
      });
  }, [searchParams.id]);

  return (
    <>
      <NavBar />
      {isLoading ? (
        <>
          {!hasError && <LoadingPage />}
          {hasError && <ErrorPage />}
        </>
      ) : (
        <Container fluid style={{ minHeight: "50%" }}>
          <Tabs activeKey={currentTab} onSelect={handleTabClick}>
            <Tab eventKey="block" title="Block View">
              <BlockCodeDisplay
                {...codeDrop}
                annotations={codeDropAnnotations}
              />
            </Tab>
            <Tab eventKey="inline" title="Inline View">
              <InlineCodeDisplay
                {...codeDrop}
                annotations={codeDropAnnotations}
              />
            </Tab>
          </Tabs>
        </Container>
      )}
      <hr />
      <CommentContainer dropId={searchParams.id} />
      <Footer />
    </>
  );
}

export default CodeDisplayContainer;
