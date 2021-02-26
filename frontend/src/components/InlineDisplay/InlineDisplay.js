import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import Switch from "react-switch";

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
  isForked,
  forkData,
  forkedFromId,
}) {
  const [sortedAnnotations, setSortedAnnotations] = useState([]);
  const [textChunks, setTextChunks] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  let chunkNum = 0;

  useEffect(() => {
    const textArray = text.split(/\n/);
    const asort = annotations.sort(annotationSortFn);
    setSortedAnnotations(asort);
    const chunks = createChunks(textArray, asort);
    setTextChunks(chunks);
  }, [text, annotations]);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Container id="inline-code-display" fluid>
      <h2>{title}</h2>
      {isForked === true ? (
        <>
          <p style={{ marginBottom: "0" }}>
            Forked from{" "}
            <Link to={{ pathname: "/view", search: `?id=${forkedFromId}` }}>
              {forkData.title}
            </Link>{" "}
            created by user{" "}
            <Link
              to={{ pathname: "/profile", search: `?id=${forkData.user.id}` }}
            >
              {forkData.user.username}
            </Link>
          </p>
        </>
      ) : null}
      <h4 className="text-muted">{description}</h4>
      <p className="text-muted" style={{ marginBottom: "0" }}>
        {lang}
      </p>
      <Row className="justify-content-end" style={{ marginBottom: "0.5rem" }}>
        <span style={{ marginRight: "0.2rem" }}>Remove Empty Chunks: </span>
        <Switch onChange={handleToggle} checked={isChecked} />
      </Row>
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
              removeEmpty={isChecked}
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
