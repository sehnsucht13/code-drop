import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/Navbar";

import DropsList from "../DropsList";
import { Button } from "react-bootstrap";
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
  const [queryParams, setQueryParams] = useState({ start: 0, count: 15 });

  const appendDrops = (newDrops) => {
    console.log("Appending drops", newDrops);
    setDrops(drops.concat(newDrops));
  };
  useEffect(() => {
    axios
      .get("/drops/paginate", {
        params: { start: queryParams.start, count: queryParams.count },
      })
      .then((result) => {
        console.log("Got the drops");
        setDrops(result.data);
      });
  }, []);
  return (
    <div>
      <NavBar />
      <DropsList drops={drops} />
      <Button
        onClick={() => getNextPage(appendDrops, setQueryParams, queryParams)}
      >
        Show More
      </Button>
    </div>
  );
}

export default HomePageContainer;
