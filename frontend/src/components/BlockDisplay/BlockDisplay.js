import React, { useEffect, useState } from "react";
import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import CodeLine from "./CodeLine";

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
  text,
  lang,
  title,
  description,
  id,
  visibility,
  annotations,
}) {
  const [paddingLength, setPaddingLength] = useState(0);
  const [indexMap, setIndexMap] = useState({});

  useEffect(() => {
    setIndexMap(generateMap(annotations));
    setPaddingLength(text.split("\n").length.toString().length);
  }, [annotations, text]);

  return (
    <div id="block-code-display">
      <h2>{title}</h2>
      <h4 className="text-muted">{description}</h4>
      <p className="text-muted">{lang}</p>
      <Highlight Prism={Prism} theme={theme} code={text} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => {
              if (i in indexMap) {
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
