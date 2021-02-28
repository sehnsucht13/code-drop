import React, { useState } from "react";
import { BsFillCaretRightFill, BsX } from "react-icons/bs";
import { IconContext } from "react-icons";
import ReactMarkdown from "react-markdown";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

export default function AnnotationPopup({ index, showIcon, annotationText }) {
  const [show, setShow] = useState(false);
  const popover = (
    <Popover
      id={index}
      style={{ background: "lightgrey", borderRadius: "5px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "2%",
        }}
      >
        <BsX onClick={() => setShow(false)} />
      </div>
      <Popover.Content>
        {showIcon && <ReactMarkdown>{annotationText}</ReactMarkdown>}
      </Popover.Content>
    </Popover>
  );

  if (showIcon) {
    return (
      <IconContext.Provider value={{ color: "blue", size: "1.5rem" }}>
        <OverlayTrigger placement="right" overlay={popover} show={show}>
          <BsFillCaretRightFill
            onClick={() => {
              setShow(!show);
            }}
          />
        </OverlayTrigger>
      </IconContext.Provider>
    );
  } else {
    return (
      <div
        style={{
          width: "15px",
          height: "10px",
          display: "inline-block",
        }}
      ></div>
    );
  }
}
