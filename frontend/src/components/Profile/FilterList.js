import React, { useState, useEffect } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import FilterListItem from "./FilterListItem";

export default function FilterList({ drops, refreshCallback }) {
  const [filteredDrops, setFilteredDrops] = useState(drops);
  const [filterInput, setFilterInput] = useState("");
  const [filterBy, setFilterBy] = useState("title");

  useEffect(() => {
    setFilteredDrops(drops);
  }, [drops]);

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
    setFilteredDrops(drops);
    setFilterBy(ev.target.value);
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Form inline style={{ paddingBottom: "1rem" }}>
        <Col xs={12} md={8} lg={9} style={{ paddingLeft: "0" }}>
          <Form.Control
            style={{ width: "100%" }}
            as="input"
            placeholder="Filter..."
            onChange={handleInput}
            value={filterInput}
          />
        </Col>
        <Col xs={12} md={4} lg={3} style={{ marginRight: "0rem" }}>
          <Row className="justify-content-end">
            <Col
              xs={6}
              lg={4}
              style={{ paddingRight: "0" }}
              className="d-flex flex-column justify-content-center"
            >
              <Form.Label>Filter By:</Form.Label>
            </Col>
            <Col xs={6} lg={8} style={{ paddingRight: "0" }}>
              <Form.Control
                as="select"
                onChange={handleFilterBy}
                value={filterBy}
                style={{ width: "100%" }}
              >
                <option value="title">Title</option>
                <option value="lang">Language</option>
              </Form.Control>
            </Col>
          </Row>
        </Col>
      </Form>
      <ListGroup
        style={{ minHeight: "25rem", maxHeight: "25rem", overflowY: "scroll" }}
      >
        {filteredDrops.length === 0 ? (
          <p className="text-center font-weight-bold">
            This user has no drops to display.
          </p>
        ) : (
          filteredDrops.map((drop, idx) => (
            <FilterListItem
              title={drop.title}
              language={drop.lang}
              id={drop.id}
              creatorId={drop.userId}
              refresh={refreshCallback}
              key={idx}
            />
          ))
        )}
      </ListGroup>
    </div>
  );
}
