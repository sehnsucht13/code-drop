import React from "react";
import AnnotationPopup from "./AnnotationPopup";

export default function CodeLine({ line, lineNum, lineProps, tokenProps }) {
  let bg;
  if (lineNum % 2 == 0) {
    bg = "red";
  } else {
    bg = "blue";
  }
  return (
    <div {...lineProps({ line, key: lineNum })}>
      <AnnotationPopup index={lineNum} />
      <span style={{ padding: "2%" }}>{lineNum + 1}</span>
      {line.map((token, key) => (
        <span {...tokenProps({ token, key })} />
      ))}
    </div>
  );
}
