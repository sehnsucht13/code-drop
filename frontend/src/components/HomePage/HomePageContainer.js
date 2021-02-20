import React, { useEffect, useState } from "react";
import { Button, Row, Container } from "react-bootstrap";
import axios from "axios";

import NavBar from "../NavBar/Navbar";
import Footer from "../Footer/Footer";
import DropsList from "../DropListDisplay/DropsList";
import LoadingPage from "../Loading/LoadingPage";

const getNextPage = (setDropsCallback, setPageParams, currentPageParams) => {
  console.log("getting next page");
  axios
    .get("/drop/paginate", {
      params: {
        start: currentPageParams.start + currentPageParams.count,
        count: currentPageParams.count,
      },
    })
    .then((result) => {
      console.log("Got a result");
      setPageParams({
        start: currentPageParams.start + currentPageParams.count,
        count: currentPageParams.count,
      });
      setDropsCallback(result.data);
    })
    .catch((err) => {
      console.log("Got an error");
    });
};

function HomePageContainer() {
  const [drops, setDrops] = useState([]);
  const [morePagesAvailable, setMorePagesAvailable] = useState(true);
  const [queryParams, setQueryParams] = useState({ start: 0, count: 15 });
  const [initialLoadDone, setInitialLoadDone] = useState(false);

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
        setInitialLoadDone(true);
      });
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <NavBar />
      {!initialLoadDone ? (
        <LoadingPage />
      ) : (
        <Container fluid>
          <DropsList drops={drops} />
          <Row className="justify-content-center">
            {morePagesAvailable ? (
              <Button
                onClick={() =>
                  getNextPage(appendDrops, setQueryParams, queryParams)
                }
                style={{ marginTop: "1rem", marginBottom: "1rem" }}
              >
                Show More
              </Button>
            ) : (
              <p>No more drops available!</p>
            )}
          </Row>
        </Container>
      )}
      <Footer />
    </div>
  );
}

export default HomePageContainer;
