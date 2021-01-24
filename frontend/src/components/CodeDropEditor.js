import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { Form, Row, Col, Button } from "react-bootstrap";
require("codemirror");
require("codemirror/lib/codemirror.css");

function CodeDropEditor() {
  const [editorContent, setEditorContent] = useState("");
  const handleEditorInput = (editor, data, value) => {
    console.log(data, value);
    setEditorContent(value);
  };
  return (
    <div>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Drop Name</Form.Label>
            <Form.Control placeholder="Code Drop Name"></Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Language</Form.Label>
            <Form.Control as="select" defaultValue="Choose...">
              <option>Choose...</option>
              <option>...</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Visibility</Form.Label>
            <Form.Control as="select" defaultValue="Public">
              <option>Public</option>
              <option>Private</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label>Editor</Form.Label>
          <CodeMirror
            value={editorContent}
            onBeforeChange={(editor, data, value) => {
              setEditorContent(value);
            }}
            onChange={(editor, data, value) => {
              console.log(value);
            }}
            options={{
              electricChars: true,
              lineNumbers: true,
            }}
          />
        </Form.Group>
      </Form>
      <Row className="justify-content-end">
        <Button>Save</Button>
      </Row>
    </div>
  );
}

export default CodeDropEditor;
