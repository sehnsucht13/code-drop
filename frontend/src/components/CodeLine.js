import React from "react";
import { IconContext } from "react-icons";
import { BsFillCaretRightFill } from "react-icons/bs";

export default function CodeLine({ line, lineNum, lineProps, tokenProps }) {
  return (
    <div {...lineProps({ line, key: lineNum })}>
      <IconContext.Provider value={{ color: "pink", size: "2%" }}>
        <BsFillCaretRightFill />
      </IconContext.Provider>
      <span style={{ padding: "2%" }}>{lineNum + 1}</span>
      {line.map((token, key) => (
        <span {...tokenProps({ token, key })} />
      ))}
    </div>
  );
}
