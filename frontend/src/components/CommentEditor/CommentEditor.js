import React, { useState } from "react";
import {
  Container,
  Row,
  InputGroup,
  FormControl,
  Tabs,
  Tab,
} from "react-bootstrap";
import EditorToolbar from "./CommentEditorToolbar";
import ReactMarkdown from "react-markdown";

export default function CommentEditor({ text, setText }) {
  const [currentTab, setcurrentTab] = useState("edit");

  const handleTextInput = (ev) => {
    setText(ev.target.value);
  };

  return (
    <Tabs
      activeKey={currentTab}
      onSelect={(key) => {
        setcurrentTab(key);
      }}
    >
      <Tab eventKey="edit" title="Edit">
        <EditorToolbar
          currentText={text}
          setInputTextFunc={(val) => {
            setText(val);
          }}
        />
        <InputGroup>
          <FormControl
            as="textarea"
            rows={3}
            value={text}
            onChange={handleTextInput}
            style={{ width: "80%" }}
          ></FormControl>
        </InputGroup>
      </Tab>
      <Tab eventKey="preview" title="Preview">
        <ReactMarkdown>{text}</ReactMarkdown>
      </Tab>
    </Tabs>
  );
}
