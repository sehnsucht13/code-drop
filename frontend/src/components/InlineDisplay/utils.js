export function annotationSortFn(a, b) {
  if (a.startLine < b.startLine) {
    return -1;
  }
  if (a.startLine > b.startLine) {
    return 1;
  }
  return 0;
}

export function createChunks(splitTextArray, sortedAnnotations) {
  let currLineIndex = 0;
  let chunks = [];
  let currChunkLines = [];
  let chunkStart = 0;

  sortedAnnotations.forEach((element, index) => {
    currChunkLines = [];
    chunkStart = currLineIndex;
    while (currLineIndex < element.startLine) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex += 1;
    }

    chunks.push({
      lines: currChunkLines,
      annotationIdx: -1,
      startIdx: chunkStart,
    });

    chunkStart = currLineIndex;
    currChunkLines = [];

    while (currLineIndex <= element.endLine) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex++;
    }
    chunks.push({
      lines: currChunkLines,
      annotationIdx: index,
      startIdx: chunkStart,
    });
    chunkStart = currLineIndex;
  });

  if (currLineIndex < splitTextArray.length) {
    currChunkLines = [];
    while (currLineIndex < splitTextArray.length) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex++;
    }
    chunks.push({
      lines: currChunkLines,
      annotationIdx: -1,
      startIdx: chunkStart,
    });
  }
  return chunks;
}
