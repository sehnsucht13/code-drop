import React, { useEffect, useState } from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import CodeLine from "./CodeLine";
import CommentContainer from "./CommentContainer";

const axios = require("axios");

const generateMap = (annotations) => {
  let indexMap = {};
  annotations.forEach((annotation) => {
    for (let i = annotation.startLine; i <= annotation.endLine; i++) {
      indexMap[i] = annotation;
    }
  });
  console.log("The generated map is:", indexMap);
  return indexMap;
};

export default function BlockCodeView({ id }) {
  // const lineNumPaddingLen = codeString.split("\n").length.toString().length;
  const [paddingLength, setPaddingLength] = useState(0);
  const [codeDrop, setCodeDrop] = useState(undefined);
  const [annotations, setAnnotations] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [indexMap, setIndexMap] = useState({});

  useEffect(() => {
    axios
      .get("/drops/21")
      .then((response) => {
        console.log(response.data);
        setCodeDrop(response.data.codeDrop);
        setAnnotations(response.data.dropAnnotations);
        setIndexMap(generateMap(response.data.dropAnnotations));
        setPaddingLength(
          response.data.codeDrop.dropText.split("\n").length.toString().length
        );
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log("There was an error in retireveing data", err);
      });
  }, []);

  if (!isLoaded) {
    return "Loading...";
  } else {
    return (
      <>
        <h1>{codeDrop.dropTitle}</h1>
        <h3>{"Language: ".concat(codeDrop.dropLanguage)}</h3>
        <Highlight
          Prism={Prism}
          theme={theme}
          code={codeDrop.dropText}
          language={codeDrop.dropLanguage}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => {
                if (i in indexMap) {
                  console.log(indexMap[i]);
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
        {/*<CommentContainer />*/}
      </>
    );
  }
}
