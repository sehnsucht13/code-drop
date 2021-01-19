import React, { useState } from "react";
import { IconContext } from "react-icons";
import { BsFillCaretRightFill } from "react-icons/bs";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";

export default function AnnotationPopup({ index }) {
  const [show, setShow] = useState(false);
  const popover = (
    <Popover
      id="popover-basic"
      style={{ background: "lightgrey", borderRadius: "5px" }}
    >
      <Popover.Title as="h3">Popover right</Popover.Title>
      <Popover.Content>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Content>
    </Popover>
  );

  return (
    <IconContext.Provider value={{ color: "blue", size: "15px" }}>
      <OverlayTrigger placement="right" overlay={popover} show={show}>
        <BsFillCaretRightFill
          onClick={() => {
            setShow(!show);
          }}
        />
      </OverlayTrigger>
    </IconContext.Provider>
  );
}
