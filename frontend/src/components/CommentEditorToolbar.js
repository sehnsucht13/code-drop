import React from "react";
import { Row, Button } from "react-bootstrap";

export default function CommentEditorToolbar({
  currentText,
  setInputTextFunc,
}) {
  const insertHeader = () => {
    setInputTextFunc(currentText.concat("\n#"));
  };
  const insertBold = () => {
    setInputTextFunc(currentText.concat("** **"));
  };
  const insertItalics = () => {};
  const insertCode = () => {};
  return (
    <Row>
      <Button onClick={insertHeader}>H</Button>
      <Button onClick={insertBold}>B</Button>
      <Button>I</Button>
      <Button>Q</Button>
      <Button>C</Button>
      <Button>L</Button>
      <Button>Bullet</Button>
      <Button>Num</Button>
      <Button>Check</Button>
    </Row>
  );
}
