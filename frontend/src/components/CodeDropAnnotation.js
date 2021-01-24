import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import CommentEditor from "./CommentEditor";

export default function CodeDropAnnotation() {
  return (
    <div>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Start Line Number</Form.Label>
            <Form.Control></Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>End Line Number</Form.Label>
            <Form.Control></Form.Control>
          </Form.Group>
        </Form.Row>
      </Form>
      <CommentEditor />
    </div>
  );
}
