import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import NavBar from "./Navbar";
import { useLocation, Link } from "react-router-dom";
import { Container, Form, Col, Button } from "react-bootstrap";
import queryString from "query-string";
import CodeMirrorLanguages from "../helpers/CodeMirrorLanguages";
import axios from "axios";

function SearchContainer() {
  const [titleInput, setTitleInput] = useState("");
  const [timePeriod, setTimePeriod] = useState("all_time");
  const [language, setLanguage] = useState("None");
  // Stores the parsed query string parameters whenever the component is rendered again.
  let searchParams = queryString.parse(useLocation().search);

  // TODO: Remove this log statement
  // console.log("Params on route are", useLocation(), searchParams);

  // React.useEffect(() => {
  //   axios
  //     .get("/drops/search", { params: { ...searchParams } })
  //     .then((response) => {
  //       console.log("Response from server is", response.data);
  //     });
  // }, [searchParams]);

  const handleTitleInput = (ev) => {
    setTitleInput(ev.target.value);
  };

  const handleLanguageSelect = (ev) => {
    setLanguage(ev.target.value);
  };

  const handleTimeSelect = (ev) => {
    setTimePeriod(ev.target.value);
    console.log(timePeriod, language, titleInput);
  };

  return (
    <div>
      <NavBar />
      <Container fluid>
        <Form>
          <Form.Row>
            <Form.Group as={Col} xs={12} sm={5}>
              <Form.Label>Drop Title</Form.Label>
              <Form.Control
                onChange={handleTitleInput}
                value={titleInput}
                placeholder="Drop Title..."
              ></Form.Control>
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={3}>
              <Form.Label> Language </Form.Label>
              <Form.Control
                as="select"
                defaultValue="None"
                onSelect={handleLanguageSelect}
              >
                {Object.keys(CodeMirrorLanguages).map((key) => {
                  return <option value={key}>{key}</option>;
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={2}>
              <Form.Label>Time Period</Form.Label>
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
            <Form.Group as={Col} xs={12} sm={2}>
              <Link
                to={{
                  pathname: "/search",
                  search: `?contains=hello`,
                }}
              >
                <Button>Search</Button>
              </Link>
            </Form.Group>
          </Form.Row>
        </Form>
      </Container>
    </div>
  );
}

export default SearchContainer;
