import React, { useState } from "react";
import { BsFillCaretRightFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import ReactMarkdown from "react-markdown";

import Highlight, { Prism } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function AnnotationPopup({
  index,
  showIcon,
  annotationText,
  snippetLines,
  snippetLang,
}) {
  const [show, setShow] = useState(false);

  const handleCaretClick = () => {
    setShow(true);
  };

  const handleModalClose = () => {
    setShow(false);
  };

  if (showIcon) {
    return (
      <>
        <IconContext.Provider value={{ color: "blue", size: "1rem" }}>
          <BsFillCaretRightFill onClick={handleCaretClick} />
        </IconContext.Provider>
        <Modal show={show} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Annotation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReactMarkdown>{annotationText}</ReactMarkdown>

            <Highlight
              Prism={Prism}
              theme={theme}
              code={snippetLines.join("\n")}
              language={snippetLang}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleModalClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else {
    return (
      <div
        style={{
          width: "15px",
          height: "10px",
          display: "inline-block",
        }}
      ></div>
    );
  }
}
