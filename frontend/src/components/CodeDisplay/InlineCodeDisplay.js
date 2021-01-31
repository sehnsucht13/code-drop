import React, { useState, useEffect } from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import CodeLine from "./CodeLine";
import InlineChunk from "./InlineChunk";

function annotationSortFn(a, b) {
  if (a.startLine < b.startLine) {
    return -1;
  }
  if (a.startLine > b.startLine) {
    return 1;
  }
  return 0;
}

function createChunks(splitTextArray, sortedAnnotations) {
  let currLineIndex = 0;

  let chunks = [];
  let currChunkLines = [];
  let chunkStart = 0;

  sortedAnnotations.forEach((element, index) => {
    currChunkLines = [];
    while (currLineIndex < element.startLine) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex++;
    }

    chunks.push({
      lines: currChunkLines,
      annotationIdx: -1,
      startIdx: chunkStart,
    });

    console.log("Current chunkstart for non-annotation", chunkStart);
    chunkStart = currLineIndex;
    currChunkLines = [];

    while (currLineIndex < element.endLine) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex++;
    }
    console.log("Current chunkstart for annotation", chunkStart);
    chunks.push({
      lines: currChunkLines,
      annotationIdx: index,
      startIdx: chunkStart,
    });
    chunkStart += currLineIndex;
  });

  if (currLineIndex < splitTextArray.length) {
    currChunkLines = [];
    while (currLineIndex < splitTextArray.endLine) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex++;
    }
    console.log("Current chunkstart is", chunkStart);
    chunks.push({
      lines: currChunkLines,
      annotationIdx: -1,
      startIdx: chunkStart,
    });
  }
  console.log("The chunks produced are ", chunks);
  return chunks;
}

function InlineCodeDisplay({
  dropText,
  dropLanguage,
  dropTitle,
  id,
  visibility,
  annotations,
}) {
  const [sortedAnnotations, setSortedAnnotations] = useState([]);
  const [textChunks, setTextChunks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const textArray = dropText.split(/\n/);

    const asort = annotations.sort(annotationSortFn);
    setSortedAnnotations(asort);
    const chunks = createChunks(textArray, asort);
    setTextChunks(chunks);
    setIsProcessing(false);
    // console.log("Here are the processed items", sortedAnnotations, textArray);
  }, [dropText]);

  if (isProcessing) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div id="inline-code-display">
        <h1>{dropTitle}</h1>
        <h3>{"Language: ".concat(dropLanguage)}</h3>
        {textChunks.map((chunk) => {
          // console.log("lines and index are:", chunk.lines, chunk.annotationIdx);
          if (chunk.annotationIdx === -1) {
            return (
              <InlineChunk
                lines={chunk.lines}
                annotation={undefined}
                lang={dropLanguage}
                offsetIdx={chunk.startIdx}
              />
            );
          } else {
            return (
              <InlineChunk
                lines={chunk.lines}
                annotation={sortedAnnotations[chunk.annotationIdx]}
                lang={dropLanguage}
                offsetIdx={chunk.startIdx}
              />
            );
          }
        })}
      </div>
    );
  }
}

export default InlineCodeDisplay;
