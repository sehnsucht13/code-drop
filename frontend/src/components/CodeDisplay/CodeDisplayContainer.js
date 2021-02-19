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

function CodeDisplayContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [codeDrop, setCodeDrop] = useState({});
  const [codeDropAnnotations, setcodeDropAnnotations] = useState([]);
  const [currentTab, setcurrentTab] = useState("block");

  const searchParams = queryString.parse(useLocation().search);
  console.log("searchParams", searchParams);

  const handleTabClick = (tabKey) => {
    setcurrentTab(tabKey);
  };

  // Load the data from the server
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/drop/${searchParams.id}`)
      .then((response) => {
        console.log("Response from the server is", response.data);
        setCodeDrop(response.data.codeDrop);
        setcodeDropAnnotations(response.data.dropAnnotations);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error encountered", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <NavBar />
      <Container fluid>
        {isLoading ? (
          <LoadingPage />
        ) : (
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
        )}
        <hr />
        <CommentContainer dropId={searchParams.id} />
      </Container>
      <Footer />
    </>
  );
}

export default CodeDisplayContainer;
