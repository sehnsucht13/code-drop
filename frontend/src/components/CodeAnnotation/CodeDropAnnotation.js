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
  const [isStartLineInvalid, setIsStartLineInvalid] = useState(false);

  const [endLineWarningMsg, setEndLineWarningMsg] = useState(undefined);
  const [isEndLineInvalid, setIsEndLineInvalid] = useState(false);

  const validateIndexValues = (startLineNum, endLineNum) => {
    let startLineWarnings = [];
    let endLineWarnings = [];

    // TODO: Refactor this. There has to be abetter way of verifying all of these conditions
    if (startLineNum.length !== 0 && isNaN(parseInt(startLineNum))) {
      startLineWarnings.push("Start line index must be a number!");
    }

    if (endLineNum.length !== 0 && isNaN(parseInt(endLineNum))) {
      endLineWarnings.push("End line index must be a number!");
    }

    if (parseInt(startLineNum) < 0) {
      startLineWarnings.push("Start line index cannot be less than 0");
    }

    if (parseInt(startLineNum) > editorInstance.lineCount()) {
      startLineWarnings.push(
        "Start line index cannot exceed the maximum number editor lines!"
      );
    }

    if (parseInt(startLineNum) < 1) {
      startLineWarnings.push("Start line index cannot be less than 1!");
    }

    if (parseInt(endLineNum) > editorInstance.lineCount()) {
      endLineWarnings.push(
        "End line index cannot exceed the maximum number editor lines!"
      );
    }

    if (parseInt(startLineNum) > parseInt(endLineNum)) {
      startLineWarnings.push(
        "Start line index must not be greater than end line index!"
      );
      endLineWarnings.push(
        "End line index must not be smaller than start line index!"
      );
    }

    if (startLineWarnings.length !== 0) {
      setStartLineWarningMsg(startLineWarnings[0]);
      setIsStartLineInvalid(true);
    } else {
      console.log("start line valid");
      setIsStartLineInvalid(false);
      setStartLineWarningMsg("");
    }
    console.log("Endline warnings", endLineWarnings);
    if (endLineWarnings.length !== 0) {
      setEndLineWarningMsg(endLineWarnings[0]);
      setIsEndLineInvalid(true);
    } else {
      setIsEndLineInvalid(false);
      setEndLineWarningMsg("");
    }
  };

  const handleStartLineNumChange = (ev) => {
    validateIndexValues(ev.target.value, endLineNum);
    setStartLineNum(ev.target.value);
  };

  const handleEndLineNumChange = (ev) => {
    validateIndexValues(startLineNum, ev.target.value);
    setendLineNum(ev.target.value);
  };

  const handleStartLineBlur = () => {
    validateIndexValues(startLineNum, endLineNum);
    saveAnnotationState(startLineNum, endLineNum, commentText, index);
  };

  const handleEndLineBlur = () => {
    validateIndexValues(startLineNum, endLineNum);
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
              type="text"
              isInvalid={isStartLineInvalid}
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
              type="text"
              isInvalid={isEndLineInvalid}
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
