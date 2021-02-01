import React, { useState } from "react";
import { InputGroup, FormControl, Tabs, Tab } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export default function CommentEditor({ value, onChange, onBlur }) {
  const [currentTab, setcurrentTab] = useState("edit");

  const handleTextInput = (ev) => {
    onChange(ev.target.value);
  };

  return (
    <Tabs
      activeKey={currentTab}
      onSelect={(key) => {
        setcurrentTab(key);
      }}
    >
      <Tab eventKey="edit" title="Edit">
        <FormControl
          as="textarea"
          rows={5}
          value={value}
          onChange={handleTextInput}
          onBlur={onBlur}
          style={{ width: "100%", marginTop: "10px" }}
        ></FormControl>
      </Tab>
      <Tab eventKey="preview" title="Preview">
        <ReactMarkdown>{value}</ReactMarkdown>
      </Tab>
    </Tabs>
  );
}
