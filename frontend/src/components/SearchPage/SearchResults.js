import React, { useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

import DropsList from "../DropListDisplay/DropsList";

function SearchResults({ searchParams }) {
  const [drops, setDrops] = useState([]);
  const [morePagesAvailable, setMorePagesAvailable] = useState(true);
  const [queryParams, setQueryParams] = useState({
    start: 0,
    count: 15,
    contains: searchParams,
  });
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    if (searchParams.contains !== undefined) {
      const newQueryParams = { start: 0, count: 15, contains: searchParams };
      setQueryParams(newQueryParams);
      setDrops([]);
      setMorePagesAvailable(true);
      axios
        .get("/drop/search", {
          params: {
            ...newQueryParams,
          },
        })
        .then((response) => {
          setHasError(false);
          setDrops(response.data);
          if (response.data.length < newQueryParams.count) {
            setMorePagesAvailable(false);
          }
        })
        .catch((err) => {
          console.error(err);
          setHasError(true);
        });
    } else {
      setMorePagesAvailable(false);
    }
  }, [searchParams]);

  const getNextPage = () => {
    axios
      .get("/drop/search", {
        params: {
          ...queryParams,
          start: queryParams.start + queryParams.count,
        },
      })
      .then((response) => {
        setHasError(false);
        setQueryParams({
          ...queryParams,
          start: queryParams.start + queryParams.count,
        });
        setDrops(drops.concat(response.data));
        if (response.data.length < queryParams.count) {
          setMorePagesAvailable(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setHasError(true);
      });
  };

  return (
    <div style={{ minHeight: "100%" }}>
      {hasError && (
        <Alert variant="danger">
          {" "}
          There was an issue with retrieving your drops. Please try searching
          again!
        </Alert>
      )}
      <DropsList drops={drops} />
      <Row className="justify-content-center" style={{ paddingTop: "1rem" }}>
        {morePagesAvailable ? (
          <Button onClick={getNextPage}>Show More</Button>
        ) : (
          <p>No more drops available!</p>
        )}
      </Row>
    </div>
  );
}

export default SearchResults;
