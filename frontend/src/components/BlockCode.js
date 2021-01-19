import React from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import CodeLine from "./CodeLine";

export default function BlockCodeView({ codeString, language }) {
  return (
    <Highlight
      Prism={Prism}
      theme={theme}
      code={codeString}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <CodeLine
              line={line}
              lineNum={i}
              lineProps={getLineProps}
              tokenProps={getTokenProps}
            />
          ))}
        </pre>
      )}
    </Highlight>
  );
}
