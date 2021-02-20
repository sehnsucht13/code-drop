import React, { useState } from "react";
import { Row, Col, ListGroup, Form } from "react-bootstrap";
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
  };

  const handleFilterBy = (ev) => {
    setFilterBy(ev.target.value);
  };

  const handleDelete = () => {};

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Form inline style={{ paddingBottom: "1rem" }}>
        <Col xs={9} style={{ paddingLeft: "0" }}>
          <Form.Control
            style={{ width: "100%" }}
            as="input"
            placeholder="Filter..."
            onChange={handleInput}
            value={filterInput}
          />
        </Col>
        <Col xs={3} style={{ paddingLeft: "0.3rem" }}>
          <Row className="justify-content-end">
            <Form.Label style={{ paddingRight: "0.5rem" }}>
              Filter By:
            </Form.Label>
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
        style={{ minHeight: "25rem", maxHeight: "25rem", overflowY: "auto" }}
      >
        {filteredDrops.map((drop) => (
          <FilterListItem
            title={drop.title}
            language={drop.lang}
            id={drop.id}
          />
        ))}
      </ListGroup>
    </div>
  );
}
