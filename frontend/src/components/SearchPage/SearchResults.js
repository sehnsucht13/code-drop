import React, { useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

import DropsList from "../DropListDisplay/DropsList";

function SearchResults({ searchParams }) {
  const [drops, setDrops] = useState([]);
  const [morePagesAvailable, setMorePagesAvailable] = useState(true);
  const [queryParams, setQueryParams] = useState({
    start: 0,
    count: 15,
    contains: searchParams,
  });

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
          setDrops(response.data);
          if (response.data.length < newQueryParams.count) {
            setMorePagesAvailable(false);
          }
        })
        .catch((error) => {
          console.log("Error", error.response);
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
    <div style={{ minHeight: "100%" }}>
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
