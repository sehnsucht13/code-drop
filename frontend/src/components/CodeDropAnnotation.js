import React, { useState } from "react";
import { Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import CommentEditor from "./CommentEditor";
import { connect } from "react-redux";

function CodeDropAnnotation({ index, id, text, startIdx, endIdx, isEdited }) {
  const [startLineNum, setStartLineNum] = useState(startIdx);
  const [endLineNum, setendLineNum] = useState(endIdx);
  const [commentText, setCommentText] = useState(text);

  const handleStartLineNumChange = (ev) => {
    setStartLineNum(ev.target.value);
  };
  const handleEndLineNumChange = (ev) => {
    setendLineNum(ev.target.value);
  };

  const handleTextChange = (newText) => {
    setCommentText(newText);
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
        <Button>Save</Button>
        <Button>Delete</Button>
        {isEdited && <Button>Discard Changes</Button>}
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
    setEditStatus: (status) =>
      dispatch({ type: "SET_EDIT_STATUS", payload: status }),
    deleteAnnotation: () =>
      dispatch({ type: "DELETE_ANNOTATION", payload: null }),
    saveAnnotationState: (start, end, text) =>
      dispatch({
        type: "SAVE_ANNOTATION_STATE",
        payload: { startLine: start, endLine: end, content: text },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropAnnotation);
