import React, { useState } from "react";
import { Button, Form, Col } from "react-bootstrap";
import CodeMirrorLanguages from "../../helpers/CodeMirrorLanguages";
import { Link } from "react-router-dom";

function SearchBar() {
  const [titleInput, setTitleInput] = useState("");
  const [timePeriod, setTimePeriod] = useState("all_time");
  const [language, setLanguage] = useState("None");

  const handleTitleInput = (ev) => {
    setTitleInput(ev.target.value);
  };

  const handleLanguageSelect = (ev) => {
    setLanguage(ev.target.value);
  };

  const handleTimeSelect = (ev) => {
    setTimePeriod(ev.target.value);
  };

  return (
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
            onChange={handleLanguageSelect}
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
              search: `?contains=${titleInput}&l=${language}&t=${timePeriod}`,
            }}
          >
            <Button>Search</Button>
          </Link>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}

export default SearchBar;
