import React, { useState } from "react";
import { connect } from "react-redux";
import { Row, Button, Dropdown, Alert } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import axios from "axios";

import CommentEditor from "../CommentEditor/CommentEditor";
import formatDate from "../../helpers/DateFormat";

function CommentDisplay({
  dropId,
  commentId,
  commentText,
  authorUsername,
  authorId,
  lastUpdate,
  refreshComments,
  isAuth,
  currentUser,
}) {
  const [shouldEdit, setShouldEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState(commentText);
  const [hasIssue, setHasIssue] = useState(false);

  const handleEditClick = () => {
    setShouldEdit(true);
  };

  const handleSaveClick = () => {
    axios
      .put(`/drop/${dropId}/comments/${commentId}`, { text: currentValue })
      .then((response) => {
        if (response.status === 200) {
          refreshComments(
            () => {
              setShouldEdit(false);
              setHasIssue(false);
            },
            () => {
              setHasIssue(true);
            }
          );
        }
      })
      .catch((err) => {
        setHasIssue(true);
      });
  };

  const handleDeleteClick = () => {
    axios
      .delete(`/drop/${dropId}/comments/${commentId}`)
      .then((response) => {
        if (response.status === 200) {
          refreshComments(
            () => {
              setHasIssue(false);
            },
            () => {
              setHasIssue(true);
            }
          );
        }
      })
      .catch((err) => {
        setHasIssue(true);
      });
  };

  const handleDiscardClick = () => {
    setHasIssue(false);
    setCurrentValue(commentText);
    setShouldEdit(false);
  };

  const handleEditorOnChange = (newVal) => {
    setCurrentValue(newVal);
  };
  const handleEditorOnBlur = (newVal) => {
    setCurrentValue(newVal);
  };

  if (shouldEdit) {
    return (
      <div
        key={commentId}
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      >
        {hasIssue && (
          <Alert variant="danger">
            There was an issue submitting your comment. Please try again!
          </Alert>
        )}
        <CommentEditor
          value={currentValue}
          onChange={handleEditorOnChange}
          onBlur={handleEditorOnBlur}
        />
        <Row className="justify-content-end" style={{ paddingRight: "1rem" }}>
          <Button onClick={handleSaveClick}>Save</Button>
          <Button onClick={handleDiscardClick}>Discard</Button>
        </Row>
      </div>
    );
  } else {
    return (
      <div
        key={commentId}
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      >
        {hasIssue && (
          <Alert variant="danger">
            There was an issue with deleting your comment. Please try again!
          </Alert>
        )}
        <Row
          className="justify-content-between"
          style={{ backgroundColor: "lightgray" }}
        >
          <span
            className="font-weight-bold"
            style={{ fontSize: "1.5rem", paddingLeft: "0.5rem" }}
          >
            {authorUsername}
          </span>
          {isAuth && currentUser.uid === authorId && (
            <Dropdown drop="down" style={{ paddingRight: "0.5rem" }}>
              <Dropdown.Toggle>
                <BsThreeDotsVertical />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEditClick}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteClick}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Row>
        <ReactMarkdown>{commentText}</ReactMarkdown>
        <Row>
          <p>{"Last Update: ".concat(formatDate(lastUpdate))}</p>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  currentUser: state.auth.user,
});

export default connect(mapStateToProps)(CommentDisplay);
