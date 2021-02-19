import React, { useState } from "react";
import { Button, Row } from "react-bootstrap";

import DropsList from "../DropsList";

import axios from "axios";

function SearchResults({ searchParams }) {
  const [drops, setDrops] = useState([]);
  const [morePagesAvailable, setMorePagesAvailable] = useState(true);
  const [queryParams, setQueryParams] = useState({
    start: 0,
    count: 15,
    ...searchParams,
  });

  React.useEffect(() => {
    const newQueryParams = { start: 0, count: 15, ...searchParams };
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
        setDrops(response.data);
        console.log(
          "Got from server for params",
          newQueryParams,
          response.data
        );
        if (response.data.length < newQueryParams.count) {
          setMorePagesAvailable(false);
        }
      })
      .catch((error) => {
        console.log("Error", error.response);
      });
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
        setQueryParams({
          ...queryParams,
          start: queryParams.start + queryParams.count,
        });
        setDrops(drops.concat(response.data));
        if (response.data.length < queryParams.count) {
          setMorePagesAvailable(false);
        }
      });
  };

  return (
    <div>
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
