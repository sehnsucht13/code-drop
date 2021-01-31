import React from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import CodeLine from "./CodeLine";
import ReactMarkdown from "react-markdown";

function InlineChunk({ lines, annotation, lang, offsetIdx }) {
  const joinedLines = lines.join("\n");
  return (
    <div
      style={{ borderWidth: "2px", borderStyle: "solid", borderColor: "black" }}
    >
      <ReactMarkdown>
        {annotation === undefined ? null : annotation.annotation_text}
      </ReactMarkdown>
      <Highlight Prism={Prism} theme={theme} code={joinedLines} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => {
              return (
                <CodeLine
                  line={line}
                  lineNum={i + offsetIdx}
                  lineProps={getLineProps}
                  tokenProps={getTokenProps}
                  lineNumPadLen={1}
                  showIcon={false}
                  annotationText={""}
                />
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default InlineChunk;
