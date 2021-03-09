import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import PrismLanguages from "../../helpers/prismLanguages";
import ReactMarkdown from "react-markdown";

import CodeLine from "../BlockDisplay/CodeLine";

function InlineChunk({
  lines,
  annotation,
  lang,
  offsetIdx,
  chunkNum,
  removeEmpty,
}) {
  const [hideChunk, setHideChunk] = useState(false);
  useEffect(() => {
    if (removeEmpty === true) {
      const filteredLines = lines.filter((line) => {
        return line.trim().length === 0 ? false : true;
      });
      if (filteredLines.length === 0) {
        setHideChunk(true);
      }
    } else {
      setHideChunk(false);
    }
  }, [removeEmpty, lines]);
  const joinedLines = lines.join("\n");

  if (hideChunk) {
    return null;
  } else {
    return (
      <Card style={{ marginBottom: "1rem" }}>
        <Card.Title className="text-center">
          {"Chunk ".concat(chunkNum)}
        </Card.Title>
        <ReactMarkdown>
          {annotation === undefined ? null : annotation}
        </ReactMarkdown>
        <Highlight
          Prism={Prism}
          theme={theme}
          code={joinedLines}
          language={PrismLanguages[lang] || null}
        >
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
}

export default InlineChunk;
