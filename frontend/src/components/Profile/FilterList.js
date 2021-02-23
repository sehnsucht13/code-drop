import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Form } from "react-bootstrap";
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
        <Col xs={12} md={9} style={{ paddingLeft: "0" }}>
          <Form.Control
            style={{ width: "100%" }}
            as="input"
            placeholder="Filter..."
            onChange={handleInput}
            value={filterInput}
          />
        </Col>
        <Col xs={12} md={3}>
          <Row className="justify-content-end">
            <Col
              xs={4}
              style={{ paddingRight: "0" }}
              className="d-flex flex-column justify-content-center"
            >
              <Form.Label>Filter By:</Form.Label>
            </Col>
            <Col xs={8}>
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
          filteredDrops.map((drop) => (
            <FilterListItem
              title={drop.title}
              language={drop.lang}
              id={drop.id}
              creatorId={drop.userId}
              refresh={refreshCallback}
            />
          ))
        )}
      </ListGroup>
    </div>
  );
}
