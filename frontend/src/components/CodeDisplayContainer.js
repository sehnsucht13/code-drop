import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./Navbar";
import BlockCodeDisplay from "./BlockCode";
import InlineCodeDisplay from "./InlineCodeDisplay";
import { Tabs, Tab } from "react-bootstrap";

function CodeDisplayContainer({ dropID }) {
  const [isLoading, setIsLoading] = useState(true);
  const [codeDrop, setCodeDrop] = useState({});
  const [codeDropAnnotations, setcodeDropAnnotations] = useState([]);
  const [currentTab, setcurrentTab] = useState("block");

  const handleTabClick = (tabKey) => {
    setcurrentTab(tabKey);
  };

  // Load the data from the server
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/drops/21`)
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
    <div>
      <NavBar />
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <Tabs activeKey={currentTab} onSelect={handleTabClick}>
          <Tab eventKey="block" title="Block View">
            <BlockCodeDisplay {...codeDrop} annotations={codeDropAnnotations} />
          </Tab>
          <Tab eventKey="inline" title="Inline View">
            <InlineCodeDisplay
              {...codeDrop}
              annotations={codeDropAnnotations}
            />
          </Tab>
        </Tabs>
      )}
    </div>
  );
}

export default CodeDisplayContainer;
