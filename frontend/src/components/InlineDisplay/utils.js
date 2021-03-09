export function annotationSortFn(a, b) {
  if (a.startLine < b.startLine) {
    return -1;
  }
  if (a.startLine > b.startLine) {
    return 1;
  }
  return 0;
}

export function createChunks(text, annotations) {
  const splitTextArray = text.split(/\n/);
  const sortedAnnotations = annotations.sort(annotationSortFn);

  let currLineIndex = 0;
  let chunks = [];
  let currChunkLines = [];
  let chunkStart = 0;

  sortedAnnotations.forEach((annotation, index) => {
    currChunkLines = [];
    chunkStart = currLineIndex + 1;

    while (currLineIndex + 1 < annotation.startLine) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex += 1;
    }

    if (currChunkLines.length !== 0) {
      chunks.push({
        lines: currChunkLines,
        annotationIdx: -1,
        startIdx: chunkStart,
        annotation_text: undefined,
      });
    }

    chunkStart = currLineIndex + 1;
    currChunkLines = [];

    while (currLineIndex + 1 <= annotation.endLine) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex += 1;
    }

    chunks.push({
      lines: currChunkLines,
      annotationIdx: index,
      startIdx: chunkStart,
      annotation_text: annotation.annotation_text,
    });
  });

  if (currLineIndex + 1 <= splitTextArray.length) {
    chunkStart = currLineIndex + 1;
    currChunkLines = [];
    while (currLineIndex + 1 <= splitTextArray.length) {
      currChunkLines.push(splitTextArray[currLineIndex]);
      currLineIndex += 1;
    }
    chunks.push({
      lines: currChunkLines,
      annotationIdx: -1,
      startIdx: chunkStart,
      annotation_text: undefined,
    });
  }
  return chunks;
}
