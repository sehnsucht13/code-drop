import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import InlineChunk from "./InlineChunk";
import { createChunks, annotationSortFn } from "./utils";

function InlineCodeDisplay({
  text,
  lang,
  title,
  description,
  id,
  visibility,
  annotations,
}) {
  const [sortedAnnotations, setSortedAnnotations] = useState([]);
  const [textChunks, setTextChunks] = useState([]);
  let chunkNum = 0;

  useEffect(() => {
    const textArray = text.split(/\n/);
    const asort = annotations.sort(annotationSortFn);
    setSortedAnnotations(asort);
    const chunks = createChunks(textArray, asort);
    setTextChunks(chunks);
  }, [text, annotations]);

  return (
    <Container id="inline-code-display" fluid>
      <h2>{title}</h2>
      <h4 className="text-muted">{description}</h4>
      <p className="text-muted">{lang}</p>
      {textChunks.map((chunk) => {
        chunkNum += 1;
        if (chunk.annotationIdx === -1) {
          return (
            <InlineChunk
              lines={chunk.lines}
              annotation={undefined}
              lang={lang}
              offsetIdx={chunk.startIdx}
              chunkNum={chunkNum}
            />
          );
        } else {
          return (
            <InlineChunk
              lines={chunk.lines}
              annotation={sortedAnnotations[chunk.annotationIdx]}
              lang={lang}
              offsetIdx={chunk.startIdx}
              chunkNum={chunkNum}
            />
          );
        }
      })}
    </Container>
  );
}

export default InlineCodeDisplay;
