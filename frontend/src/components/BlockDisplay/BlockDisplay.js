import React, { useEffect, useState } from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import { Link } from "react-router-dom";
import CodeLine from "./CodeLine";
import PrismLanguages from "../../helpers/prismLanguages";

export default function BlockCodeView({
  text,
  lang,
  title,
  description,
  isForked,
  forkData,
  forkedFromId,
  annotationChunks,
}) {
  const [paddingLength, setPaddingLength] = useState(0);
  const [chunks, setChunks] = useState([]);

  useEffect(() => {
    setPaddingLength(text.split("\n").length.toString().length);
    setChunks(annotationChunks);
  }, [annotationChunks, text]);

  return (
    <div id="block-code-display">
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
      <p className="text-muted">{lang}</p>
      <Highlight
        Prism={Prism}
        theme={theme}
        code={text}
        language={PrismLanguages[lang] || null}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {chunks.map((chunk, idx) => {
              return chunk.lines.map((line, idx) => {
                let currTokenIdx = chunk.startIdx + idx - 1;
                return (
                  <CodeLine
                    line={tokens[currTokenIdx]}
                    lineNum={currTokenIdx + 1}
                    lineProps={getLineProps}
                    tokenProps={getTokenProps}
                    lineNumPadLen={paddingLength}
                    showIcon={chunk.annotation_text !== undefined}
                    annotationText={chunk.annotation_text || ""}
                    snippetLines={chunk.lines}
                    snippetLang={PrismLanguages[lang] || null}
                    key={currTokenIdx}
                  />
                );
              });
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
