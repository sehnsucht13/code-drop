import React from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import CodeLine from "../BlockDisplay/CodeLine";
import ReactMarkdown from "react-markdown";
import { Card } from "react-bootstrap";

function InlineChunk({ lines, annotation, lang, offsetIdx, chunkNum }) {
  const joinedLines = lines.join("\n");
  return (
    <Card style={{ marginBottom: "1rem" }}>
      <Card.Title className="text-center">
        {"Chunk ".concat(chunkNum)}
      </Card.Title>
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
    </Card>
  );
}

export default InlineChunk;
