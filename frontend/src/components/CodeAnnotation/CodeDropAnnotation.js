import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import CommentEditor from "../CommentEditor/CommentEditor";
import {
  delete_annotation,
  save_annotation,
  set_annotation_error_status,
} from "../../actions/annotation_actions";

function CodeDropAnnotation({
  index,
  id,
  text,
  startIdx,
  endIdx,
  hasError,
  editorLineCount,
  deleteAnnotation,
  saveAnnotationState,
  set_annotation_error_status,
}) {
  // State of text inputs
  const [startLineNum, setStartLineNum] = useState(startIdx);
  const [endLineNum, setendLineNum] = useState(endIdx);
  const [commentText, setCommentText] = useState(text);

  useEffect(() => {
    setStartLineNum(startIdx);
    setendLineNum(endIdx);
    setCommentText(text);
  }, [startIdx, endIdx, text]);

  // Contains warning status and message for start line index
  const [startLineWarningMsg, setStartLineWarningMsg] = useState(undefined);
  const [isStartLineInvalid, setIsStartLineInvalid] = useState(false);
  // Contains warning status and message for end line index
  const [endLineWarningMsg, setEndLineWarningMsg] = useState(undefined);
  const [isEndLineInvalid, setIsEndLineInvalid] = useState(false);

  const validateInputIndexValues = (startLineNum, endLineNum) => {
    let startLineWarnings = [];
    let endLineWarnings = [];

    // TODO: Refactor this. There has to be abetter way of verifying all of these conditions
    // Src: https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
    // using "parseInt" will stop parsing as soon as it encounters an integer. Therefore
    // the string "23afc" will result in the number 23 instead of NaN value.
    if (startLineNum.length !== 0 && isNaN(startLineNum)) {
      startLineWarnings.push("Start line index must be a number!");
    }

    if (endLineNum.length !== 0 && isNaN(endLineNum)) {
      endLineWarnings.push("End line index must be a number!");
    }

    if (parseInt(startLineNum) < 0) {
      startLineWarnings.push("Start line index cannot be less than 0");
    }

    if (parseInt(startLineNum) > editorLineCount) {
      startLineWarnings.push(
        "Start line index cannot exceed the maximum number editor lines!"
      );
    }

    if (parseInt(startLineNum) < 1) {
      startLineWarnings.push("Start line index cannot be less than 1!");
    }

    if (parseInt(endLineNum) > editorLineCount) {
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
      setIsStartLineInvalid(false);
      setStartLineWarningMsg("");
    }
    if (endLineWarnings.length !== 0) {
      setEndLineWarningMsg(endLineWarnings[0]);
      setIsEndLineInvalid(true);
    } else {
      setIsEndLineInvalid(false);
      setEndLineWarningMsg("");
    }

    // Set error status to prevent submission if there is an error in either one of the
    // indexes.
    return endLineWarnings.length !== 0 || startLineWarnings.length !== 0;
  };

  useEffect(() => {
    validateInputIndexValues(startLineNum, endLineNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorLineCount]);

  const handleStartLineNumChange = (ev) => {
    validateInputIndexValues(ev.target.value, endLineNum);
    setStartLineNum(ev.target.value);
  };

  const handleEndLineNumChange = (ev) => {
    validateInputIndexValues(startLineNum, ev.target.value);
    setendLineNum(ev.target.value);
  };

  const handleStartLineBlur = () => {
    const errorStatus = validateInputIndexValues(startLineNum, endLineNum);
    saveAnnotationState(startLineNum, endLineNum, commentText, index);
    if (errorStatus !== hasError) {
      set_annotation_error_status(index, errorStatus);
    }
  };

  const handleEndLineBlur = () => {
    const errorStatus = validateInputIndexValues(startLineNum, endLineNum);
    saveAnnotationState(startLineNum, endLineNum, commentText, index);
    if (errorStatus !== hasError) {
      set_annotation_error_status(index, errorStatus);
    }
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
  const annotationProps = state.annotationReducer.annotations[ownProps.index];
  // console.log(
  //   "State for annotation at index",
  //   ownProps.index,
  //   "is: ",
  //   annotationProps
  // );
  return {
    index: ownProps.index,
    id: annotationProps.id,
    text: annotationProps.text,
    startIdx: annotationProps.start,
    endIdx: annotationProps.end,
    hasError: annotationProps.hasError,
    editorLineCount: state.newDrop.editorLineCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAnnotation: (idx) => dispatch(delete_annotation(idx)),
    saveAnnotationState: (start, end, text, idx) =>
      dispatch(save_annotation(start, end, text, idx)),
    set_annotation_error_status: (idx, status) =>
      dispatch(set_annotation_error_status(idx, status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropAnnotation);
