import React, { useState } from "react";
import FormControl from "react-bootstrap/FormControl";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ReactMarkdown from "react-markdown";

export default function CommentEditor({ value, onChange, onBlur }) {
  const [currentTab, setcurrentTab] = useState("edit");

  const handleTextInput = (ev) => {
    onChange(ev.target.value);
  };

  const handleTextBlur = (ev) => {
    onBlur(ev.target.value);
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
          onBlur={handleTextBlur}
          style={{ width: "100%", marginTop: "10px" }}
        ></FormControl>
      </Tab>
      <Tab eventKey="preview" title="Preview">
        <ReactMarkdown>{value}</ReactMarkdown>
      </Tab>
    </Tabs>
  );
}
