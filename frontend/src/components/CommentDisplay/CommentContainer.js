import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Alert, Row } from "react-bootstrap";
import axios from "axios";
import CommentDisplay from "./CommentDisplay";
import CommentEditor from "../CommentEditor/CommentEditor";

function CommentContainer({ dropId, isAuth }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [hasSubmitIssue, setHasSubmitIssue] = useState(false);

  const handleEditorOnChange = (newVal) => {
    setNewCommentText(newVal);
  };
  const handleEditorOnBlur = (newVal) => {
    setNewCommentText(newVal);
  };

  const refreshComments = (successCallback, errorCallback) => {
    axios
      .get(`/drop/${dropId}/comments`)
      .then((response) => {
        if (response.status === 200) {
          setComments(response.data);
          successCallback();
        }
      })
      .catch((err) => {
        errorCallback(err);
      });
  };

  const handleNewCommentSubmit = () => {
    axios
      .post(`/drop/${dropId}/comments`, {
        text: newCommentText,
      })
      .then((response) => {
        if (response.status === 200) {
          axios
            .get(`/drop/${dropId}/comments`)
            .then((response) => {
              if (response.status === 200) {
                setHasSubmitIssue(false);
                setNewCommentText("");
                setComments(response.data);
              }
            })
            .catch((err) => {
              setHasSubmitIssue(false);
            });
        }
      })
      .catch((err) => {
        console.log("Have an error");
        setHasSubmitIssue(true);
      });
  };

  useEffect(() => {
    axios
      .get(`/drop/${dropId}/comments`)
      .then((response) => {
        if (response.status === 200) {
          setComments(response.data);
        }
      })
      .catch((err) => {});
  }, [dropId]);

  return (
    <>
      {comments.map((comment) => (
        <CommentDisplay
          dropId={dropId}
          commentId={comment.id}
          commentText={comment.text}
          authorUsername={comment.user.username}
          authorId={comment.user.id}
          lastUpdate={comment.updatedAt}
          refreshComments={refreshComments}
        />
      ))}
      <hr />
      {isAuth ? (
        <>
          {hasSubmitIssue && (
            <Alert variant="danger">
              There was an issue submitting your comment. Please try again!
            </Alert>
          )}
          <div style={{ paddingBottom: "2rem" }}>
            <CommentEditor
              value={newCommentText}
              onChange={handleEditorOnChange}
              onBlur={handleEditorOnBlur}
            />
            <Row
              className="justify-content-end"
              style={{ paddingRight: "1rem", paddingTop: "0.5rem" }}
            >
              <Button onClick={handleNewCommentSubmit}>Submit</Button>
            </Row>
          </div>
        </>
      ) : (
        <Row
          className="justify-content-center"
          style={{ paddingBottom: "1rem" }}
        >
          <Button>Sign In to comment</Button>
        </Row>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps)(CommentContainer);
