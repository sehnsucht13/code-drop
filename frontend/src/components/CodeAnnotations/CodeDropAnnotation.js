import React, { useState } from "react";
import { Form, Col, Button, ButtonGroup } from "react-bootstrap";
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
  const annotationInfo = state.annotationReducer.annotations[ownProps.index];
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
      dispatch(set_annotation_edit_status(status, idx)),
    deleteAnnotation: (idx) => dispatch(delete_annotation(idx)),
    saveAnnotationState: (start, end, text, idx) =>
      dispatch(save_annotation(start, end, text, idx)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropAnnotation);
