import React, { useState } from "react";
import { connect } from "react-redux";
import { Row, Button, Dropdown, Alert, Card, Col } from "react-bootstrap";
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
        <Row
          className="justify-content-end"
          style={{ paddingRight: "1rem", paddingTop: "0.5rem" }}
        >
          <Button onClick={handleSaveClick}>Save</Button>
          <Button onClick={handleDiscardClick}>Discard</Button>
        </Row>
      </div>
    );
  } else {
    return (
      <div
        key={commentId}
        style={{
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.5rem",
        }}
      >
        {hasIssue && (
          <Alert variant="danger">
            There was an issue with deleting your comment. Please try again!
          </Alert>
        )}
        <Card>
          <Card.Header
            className="d-flex flex-row justify-content-between"
            style={{
              paddingTop: "0",
              paddingBottom: "0.1rem",
              paddingRight: "0",
              paddingLeft: "0",
            }}
          >
            <Col xs={11}>
              <p
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "500",
                  paddingBottom: "0",
                  marginBottom: "0",
                }}
              >
                {authorUsername}
              </p>

              <p className="text-muted" style={{ marginBottom: "0" }}>
                {formatDate(lastUpdate)}
              </p>
            </Col>
            {isAuth && currentUser.uid === authorId && (
              <Col
                xs={1}
                className="d-flex flex-row justify-content-end align-items-end"
                style={{ paddingRight: "0" }}
              >
                <Dropdown drop="down">
                  <Dropdown.Toggle>
                    <BsThreeDotsVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleEditClick}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleDeleteClick}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            )}
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <ReactMarkdown>{commentText}</ReactMarkdown>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  currentUser: state.auth.user,
});

export default connect(mapStateToProps)(CommentDisplay);
