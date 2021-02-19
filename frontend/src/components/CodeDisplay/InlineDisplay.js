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
  const [isProcessing, setIsProcessing] = useState(true);
  let chunkNum = 0;

  useEffect(() => {
    const textArray = text.split(/\n/);
    console.log("keeps running");
    const asort = annotations.sort(annotationSortFn);
    setSortedAnnotations(asort);
    const chunks = createChunks(textArray, asort);
    setTextChunks(chunks);
    setIsProcessing(false);
  }, []);

  if (isProcessing) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <Container id="inline-code-display" fluid>
        <h1>{title}</h1>
        <p className="text-muted">
          {description} <br /> {lang}
        </p>
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
}

export default InlineCodeDisplay;
