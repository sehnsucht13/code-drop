import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Switch from "react-switch";

import InlineChunk from "./InlineChunk";

function InlineCodeDisplay({
  text,
  lang,
  title,
  description,
  isForked,
  forkData,
  forkedFromId,
  annotationChunks,
}) {
  const [unfilteredChunks, setUnfilteredChunks] = useState([]);
  const [filteredChunks, setFilteredChunks] = useState([]);
  const [hideEmpty, setHideEmpty] = useState(false);
  let chunkNum = 0;

  useEffect(() => {
    setUnfilteredChunks(annotationChunks);
    const filteredChunks = annotationChunks.filter((annotation) => {
      if (
        annotation.annotation_text ||
        annotation.lines.join("").trim().length !== 0
      ) {
        return true;
      }
      return false;
    });
    setFilteredChunks(filteredChunks);
  }, [annotationChunks]);

  const handleToggle = () => {
    setHideEmpty(!hideEmpty);
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
        <Switch onChange={handleToggle} checked={hideEmpty} />
      </Row>
      {hideEmpty
        ? filteredChunks.map((chunk) => {
            chunkNum += 1;
            return (
              <InlineChunk
                lines={chunk.lines}
                annotation={chunk.annotation_text}
                lang={lang}
                offsetIdx={chunk.startIdx}
                chunkNum={chunkNum}
                key={chunkNum}
              />
            );
          })
        : unfilteredChunks.map((chunk) => {
            chunkNum += 1;
            return (
              <InlineChunk
                lines={chunk.lines}
                annotation={chunk.annotation_text}
                lang={lang}
                offsetIdx={chunk.startIdx}
                chunkNum={chunkNum}
                key={chunkNum}
              />
            );
          })}
    </Container>
  );
}

export default InlineCodeDisplay;
