import React, { useEffect, useState } from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import CodeLine from "./CodeLine";

const axios = require("axios");

const generateMap = (annotations) => {
  let indexMap = {};
  annotations.forEach((annotation) => {
    for (let i = annotation.startLine; i <= annotation.endLine; i++) {
      indexMap[i] = annotation;
    }
  });
  // console.log("The generated map is:", indexMap);
  return indexMap;
};

export default function BlockCodeView({
  dropText,
  dropLanguage,
  dropTitle,
  id,
  visibility,
  annotations,
}) {
  const [paddingLength, setPaddingLength] = useState(0);
  const [indexMap, setIndexMap] = useState({});

  useEffect(() => {
    setIndexMap(generateMap(annotations));
    setPaddingLength(dropText.split("\n").length.toString().length);
  }, [annotations, dropText]);

  return (
    <div id="block-code-display">
      <h1>{dropTitle}</h1>
      <h3>{"Language: ".concat(dropLanguage)}</h3>
      <Highlight
        Prism={Prism}
        theme={theme}
        code={dropText}
        language={dropLanguage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => {
              if (i in indexMap) {
                // console.log(indexMap[i]);
                return (
                  <CodeLine
                    line={line}
                    lineNum={i}
                    lineProps={getLineProps}
                    tokenProps={getTokenProps}
                    lineNumPadLen={paddingLength}
                    showIcon={true}
                    annotationText={indexMap[i].annotation_text}
                  />
                );
              } else {
                return (
                  <CodeLine
                    line={line}
                    lineNum={i}
                    lineProps={getLineProps}
                    tokenProps={getTokenProps}
                    lineNumPadLen={paddingLength}
                    showIcon={false}
                    annotationText={""}
                  />
                );
              }
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
