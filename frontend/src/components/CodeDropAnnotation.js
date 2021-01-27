import React, { useState } from "react";
import { Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import CommentEditor from "./CommentEditor";
import { connect } from "react-redux";

function CodeDropAnnotation({
  index,
  id,
  text,
  startIdx,
  endIdx,
  isEdited,
  deleteAnnotation,
  setEditStatus,
  saveAnnotationState,
}) {
  const [startLineNum, setStartLineNum] = useState(startIdx);
  const [endLineNum, setendLineNum] = useState(endIdx);
  const [commentText, setCommentText] = useState(text);

  const handleStartLineNumChange = (ev) => {
    if (!isEdited) {
      setEditStatus(true, index);
    }
    setStartLineNum(ev.target.value);
  };
  const handleEndLineNumChange = (ev) => {
    if (!isEdited) {
      setEditStatus(true, index);
    }
    setendLineNum(ev.target.value);
  };

  const handleTextChange = (newText) => {
    if (!isEdited) {
      setEditStatus(true, index);
    }
    setCommentText(newText);
  };

  const handleDelete = () => {
    deleteAnnotation(index);
  };

  const handleSave = () => {
    saveAnnotationState(startLineNum, endLineNum, commentText, index);
  };

  const handleDiscard = () => {
    setCommentText(text);
    setendLineNum(endIdx);
    setStartLineNum(startIdx);
    setEditStatus(false, index);
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
            ></Form.Control>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>End Line Number</Form.Label>
            <Form.Control
              value={endLineNum}
              onChange={handleEndLineNumChange}
            ></Form.Control>
          </Form.Group>
        </Form.Row>
      </Form>
      <CommentEditor text={commentText} setText={handleTextChange} />
      <ButtonGroup>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleDelete}>Delete</Button>
        {isEdited && <Button onClick={handleDiscard}>Discard Changes</Button>}
      </ButtonGroup>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  console.log("For Drop Own props", ownProps);
  const annotationInfo = state.annotations[ownProps.index];
  return {
    index: ownProps.index,
    id: annotationInfo.id,
    text: annotationInfo.text,
    startIdx: annotationInfo.start,
    endIdx: annotationInfo.end,
    isEdited: annotationInfo.isEdited,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEditStatus: (status, idx) =>
      dispatch({
        type: "SET_EDIT_STATUS",
        payload: { status: status, index: idx },
      }),
    deleteAnnotation: (idx) =>
      dispatch({ type: "DELETE_ANNOTATION", payload: { index: idx } }),
    saveAnnotationState: (start, end, text, idx) =>
      dispatch({
        type: "SAVE_ANNOTATION_STATE",
        payload: { startLine: start, endLine: end, content: text, index: idx },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropAnnotation);
