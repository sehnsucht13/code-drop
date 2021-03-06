import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

function SearchBar({ searchInput }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [timePeriod, setTimePeriod] = useState("all_time");
  const [searchField, setSearchField] = useState("title");

  useEffect(() => {
    setSearchTerm(searchInput || "");
  }, [searchInput]);

  const handleSearchTerm = (ev) => {
    setSearchTerm(ev.target.value);
  };

  const handleSearchFieldSelect = (ev) => {
    setSearchField(ev.target.value);
  };

  const handleTimeSelect = (ev) => {
    setTimePeriod(ev.target.value);
  };

  return (
    <>
      <Form>
        <Form.Row>
          <Form.Group as={Col} xs={12} sm={5} lg={6}>
            <Form.Label>Search Term:</Form.Label>
            <Form.Control
              onChange={handleSearchTerm}
              value={searchTerm}
              placeholder="Search Term..."
            ></Form.Control>
          </Form.Group>
          <Form.Group as={Col} xs={6} sm={3}>
            <Form.Label> Search By:</Form.Label>
            <Form.Control
              as="select"
              defaultValue="title"
              onChange={handleSearchFieldSelect}
            >
              <option value="title">Title</option>
              <option value="language">Language</option>
              <option value="user">User</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} xs={6} sm={2}>
            <Form.Label>Time Period:</Form.Label>
            <Form.Control
              as="select"
              defaultValue="all_time"
              onChange={handleTimeSelect}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
              <option value="all_time">All Time</option>
            </Form.Control>
          </Form.Group>
          <Form.Group
            as={Col}
            xs={12}
            sm={2}
            lg={1}
            className="d-flex flex-column justify-content-end align-items-center"
          >
            <Link
              to={{
                pathname: "/search",
                search: `?contains=${searchTerm}&field=${searchField}&t=${timePeriod}`,
              }}
            >
              <Button type="submit">Search</Button>
            </Link>
          </Form.Group>
        </Form.Row>
      </Form>
      <hr style={{ marginTop: "0" }} className="d-md-none"></hr>
    </>
  );
}

export default SearchBar;
