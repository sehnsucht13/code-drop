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

export default function CommentEditor() {
  const [commentText, setCommentText] = useState("");
  const [currentTab, setcurrentTab] = useState("edit");

  const handleTextInput = (ev) => {
    setCommentText(ev.target.value);
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
          currentText={commentText}
          setInputTextFunc={(val) => {
            setCommentText(val);
          }}
        />
        <InputGroup>
          <FormControl
            as="textarea"
            rows={3}
            value={commentText}
            onChange={handleTextInput}
            style={{ width: "80%" }}
          ></FormControl>
        </InputGroup>
      </Tab>
      <Tab eventKey="preview" title="Preview">
        <ReactMarkdown>{commentText}</ReactMarkdown>
      </Tab>
    </Tabs>
  );
}
