import React, { useState } from "react";
import {
  Row,
  Button,
  Col,
  ListGroup,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import FilterListItem from "./FilterListItem";

export default function FilterList({ drops }) {
  const [filteredDrops, setFilteredDrops] = useState(drops);
  const [filterInput, setFilterInput] = useState("");
  const [filterBy, setFilterBy] = useState("title");

  const handleInput = (ev) => {
    const newFilterInput = ev.target.value;
    if (newFilterInput.length === 0) {
      setFilteredDrops(drops);
    } else {
      const newFilteredList = drops.filter((drop) => {
        if (drop[filterBy].includes(newFilterInput)) {
          return true;
        }
        return false;
      });
      setFilteredDrops(newFilteredList);
    }
    setFilterInput(newFilterInput);
    // console.log("New input is", filterInput, ev.target.value);
  };

  const handleFilterBy = (ev) => {
    setFilterBy(ev.target.value);
  };

  const handleDelete = () => {};

  return (
    <Col xs={12}>
      <Form inline>
        <Col xs={8}>
          <Form.Control
            style={{ width: "100%" }}
            as="input"
            placeholder="Filter..."
            onChange={handleInput}
            value={filterInput}
          />
        </Col>
        <Col xs={4}>
          <Row className="justify-content-around">
            <Form.Label>Filter By:</Form.Label>
            <Form.Control
              as="select"
              onChange={handleFilterBy}
              value={filterBy}
            >
              <option value="title">Title</option>
              <option value="language">Language</option>
            </Form.Control>
          </Row>
        </Col>
      </Form>
      <ListGroup
        as="div"
        style={{ minHeight: "25rem", maxHeight: "25rem", overflowY: "auto" }}
      >
        {filteredDrops.map((drop) => (
          <FilterListItem
            title={drop.title}
            language={drop.language}
            id={drop.id}
          />
        ))}
      </ListGroup>
    </Col>
  );
}
