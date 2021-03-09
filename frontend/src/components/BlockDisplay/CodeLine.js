import React from "react";
import AnnotationPopup from "./AnnotationPopup";

export default function CodeLine({
  line,
  lineNum,
  lineProps,
  tokenProps,
  lineNumPadLen,
  snippetLines,
  snippetLang,
  annotationText,
  showIcon,
}) {
  let numLen = lineNum.toString().length;
  let padLen = lineNumPadLen - numLen;
  let pad = "";
  for (let index = 0; index < padLen; index++) {
    pad += " ";
  }

  return (
    <div {...lineProps({ line, key: lineNum })}>
      <AnnotationPopup
        index={lineNum}
        showIcon={showIcon}
        annotationText={annotationText}
        snippetLines={snippetLines}
        snippetLang={snippetLang}
      />
      <span style={{ paddingRight: "2%", paddingLeft: "1%" }}>
        {lineNum.toString().concat(pad)}
      </span>
      {line.map((token, key) => (
        <span key={lineNum} {...tokenProps({ token, key })} />
      ))}
    </div>
  );
}
