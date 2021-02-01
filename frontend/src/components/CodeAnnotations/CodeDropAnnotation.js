import React, { useState } from "react";
import { Form, Row, FormControl, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import CommentEditor from "../CommentEditor/CommentEditor";
import {
  set_annotation_edit_status,
  delete_annotation,
  save_annotation,
} from "../../actions/annotation_actions";

function CodeDropAnnotation({
  index,
  id,
  text,
  startIdx,
  endIdx,
  isEdited,
  editorInstance,
  deleteAnnotation,
  saveAnnotationState,
}) {
  const [startLineNum, setStartLineNum] = useState(startIdx);
  const [endLineNum, setendLineNum] = useState(endIdx);
  const [commentText, setCommentText] = useState(text);

  const [startLineWarningMsg, setStartLineWarningMsg] = useState(undefined);
  const [endLineWarningMsg, setEndLineWarningMsg] = useState(undefined);

  const validateStartIndex = (val) => {
    if (isNaN(val)) {
      setStartLineWarningMsg("Start index must be an integer!");
    } else if (val > editorInstance.lineCount()) {
      // Case of input referencing a line number that does not exist
      setStartLineWarningMsg(
        "Start index cannot exceed the total number of lines of code!"
      );
    } else if (val > endLineNum) {
      setStartLineWarningMsg("Start Index cannot exceed the End Index.");
    } else {
      setStartLineWarningMsg(undefined);
    }
  };

  const validateEndIndex = (val) => {
    if (isNaN(val)) {
      setEndLineWarningMsg("End index must be an integer!");
    } else if (val > editorInstance.lineCount()) {
      // Case of input referencing a line number that does not exist
      setEndLineWarningMsg(
        "End index cannot exceed the total number of lines of code!"
      );
    } else if (val < startLineNum) {
      setEndLineWarningMsg("End Index cannot be smaller than the Start Index");
    } else {
      setEndLineWarningMsg(undefined);
    }
  };

  const handleStartLineNumChange = (ev) => {
    console.log("Number of lines in editor are:", editorInstance.lineCount());
    validateStartIndex(parseInt(ev.target.value));
    setStartLineNum(ev.target.value);
  };

  const handleEndLineNumChange = (ev) => {
    validateEndIndex(parseInt(ev.target.value));
    setendLineNum(ev.target.value);
  };

  const handleStartLineBlur = () => {
    validateStartIndex(parseInt(startLineNum));
    saveAnnotationState(startLineNum, endLineNum, commentText, index);
  };

  const handleEndLineBlur = () => {
    validateEndIndex(parseInt(endLineNum));
    saveAnnotationState(startLineNum, endLineNum, commentText, index);
  };

  const handleTextChange = (newText) => {
    setCommentText(newText);
  };

  const handleTextBlur = () => {
    saveAnnotationState(startLineNum, endLineNum, commentText, index);
  };

  const handleDelete = () => {
    deleteAnnotation(index);
  };

  return (
    <div key={id}>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Start Line Number</Form.Label>
            <Form.Control
              value={startLineNum}
              onChange={handleStartLineNumChange}
              onBlur={handleStartLineBlur}
              type="number"
              as="input"
              min="1"
              isInvalid={startLineWarningMsg ? true : false}
            ></Form.Control>
            <FormControl.Feedback type="invalid">
              {startLineWarningMsg}
            </FormControl.Feedback>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>End Line Number</Form.Label>
            <Form.Control
              value={endLineNum}
              onChange={handleEndLineNumChange}
              onBlur={handleEndLineBlur}
              type="number"
              as="input"
              min="1"
              isInvalid={endLineWarningMsg ? true : false}
            ></Form.Control>
            <FormControl.Feedback type="invalid">
              {endLineWarningMsg}
            </FormControl.Feedback>
          </Form.Group>
        </Form.Row>
      </Form>
      <CommentEditor
        value={commentText}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
      />
      <Row className="justify-content-end">
        <Button
          onClick={handleDelete}
          style={{ marginRight: "15px", marginTop: "5px" }}
        >
          Delete Annotation
        </Button>
      </Row>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const annotationInfo = state.annotationReducer.annotations[ownProps.index];
  return {
    index: ownProps.index,
    id: annotationInfo.id,
    text: annotationInfo.text,
    startIdx: annotationInfo.start,
    endIdx: annotationInfo.end,
    isEdited: annotationInfo.isEdited,
    editorInstance: state.editor.instance,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEditStatus: (status, idx) =>
      dispatch(set_annotation_edit_status(status, idx)),
    deleteAnnotation: (idx) => dispatch(delete_annotation(idx)),
    saveAnnotationState: (start, end, text, idx) =>
      dispatch(save_annotation(start, end, text, idx)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropAnnotation);
