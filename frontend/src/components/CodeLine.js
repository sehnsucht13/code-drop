import React from "react";

export default function CodeLine({ line, lineNum, lineProps, tokenProps }) {
  return (
    <div {...lineProps({ line, key: lineNum })}>
      <span style={{ padding: "2%" }}>{lineNum + 1}</span>
      {line.map((token, key) => (
        <span {...tokenProps({ token, key })} />
      ))}
    </div>
  );
}
