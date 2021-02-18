import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/Navbar";

import DropsList from "../DropsList";
import { Button, Row, Container } from "react-bootstrap";
const axios = require("axios");

const getNextPage = (setDropsCallback, setPageParams, currentPageParams) => {
  axios
    .get("/drops/paginate", {
      params: {
        start: currentPageParams.start + currentPageParams.count,
        count: currentPageParams.count,
      },
    })
    .then((result) => {
      setPageParams({
        start: currentPageParams.start + currentPageParams.count,
        count: currentPageParams.count,
      });
      setDropsCallback(result.data);
    });
};

function HomePageContainer() {
  const [drops, setDrops] = useState([]);
  const [morePagesAvailable, setMorePagesAvailable] = useState(true);
  const [queryParams, setQueryParams] = useState({ start: 0, count: 15 });

  const appendDrops = (newDrops) => {
    if (newDrops.length === 0) {
      setMorePagesAvailable(false);
    } else {
      setDrops(drops.concat(newDrops));
    }
  };
  useEffect(() => {
    axios
      .get("/drop/paginate", {
        params: { start: queryParams.start, count: queryParams.count },
      })
      .then((result) => {
        console.log("Got the drops", result.data);
        if (result.data.length === 0) {
          setMorePagesAvailable(false);
        }
        setDrops(result.data);
      });
  }, []);
  return (
    <div>
      <NavBar />
      <Container fluid>
        <DropsList drops={drops} />
        <Row className="justify-content-center">
          {morePagesAvailable ? (
            <Button
              onClick={() =>
                getNextPage(appendDrops, setQueryParams, queryParams)
              }
            >
              Show More
            </Button>
          ) : (
            <p>No more drops available!</p>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default HomePageContainer;
