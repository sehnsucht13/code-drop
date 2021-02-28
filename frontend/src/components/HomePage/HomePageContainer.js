import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

import NavBar from "../NavBar/Navbar";
import Footer from "../Footer/Footer";
import DropsList from "../DropListDisplay/DropsList";
import LoadingPage from "../Loading/LoadingPage";

function HomePageContainer() {
  const [drops, setDrops] = useState([]);
  const [morePagesAvailable, setMorePagesAvailable] = useState(true);
  const [queryParams, setQueryParams] = useState({ start: 0, count: 7 });
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const appendDrops = (newDrops) => {
    if (newDrops.length === 0) {
      setMorePagesAvailable(false);
    } else {
      setDrops(drops.concat(newDrops));
      if (newDrops.length < queryParams.count) {
        setMorePagesAvailable(false);
      }
    }
  };

  const fetchNextPage = () => {
    axios
      .get("/drop/paginate", {
        params: {
          start: queryParams.start + queryParams.count,
          count: queryParams.count,
        },
      })
      .then((result) => {
        setQueryParams({
          start: queryParams.start + queryParams.count,
          count: queryParams.count,
        });
        appendDrops(result.data);
      })
      .catch((err) => {
        setHasLoadError(true);
      });
  };

  useEffect(() => {
    axios
      .get("/drop/paginate", {
        params: { start: queryParams.start, count: queryParams.count },
      })
      .then((result) => {
        if (result.data.length === 0) {
          setMorePagesAvailable(false);
        }
        setDrops(result.data);
        setInitialLoadDone(true);
      })
      .catch((err) => {
        setInitialLoadDone(true);
        setHasLoadError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!initialLoadDone) {
    return (
      <div className="vh-100">
        <NavBar />
        <LoadingPage />
        <Footer />
      </div>
    );
  } else {
  }
  return (
    <div className="vh-100">
      <NavBar />
      <Container fluid>
        {hasLoadError && (
          <Alert>
            There was an error with loading the drops! Please refresh the page.
          </Alert>
        )}
        <DropsList drops={drops} />
        <Row
          className="justify-content-center"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          {morePagesAvailable ? (
            <Button onClick={() => fetchNextPage()}>Show More</Button>
          ) : (
            <p>No more drops available!</p>
          )}
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default HomePageContainer;
