import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import axios from "axios";
import CommentDisplay from "./CommentDisplay";
import CommentEditor from "../CommentEditor/CommentEditor";
import FetchingComments from "../Loading/FetchingComments";

function CommentContainer({ dropId, isAuth }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [hasSubmitIssue, setHasSubmitIssue] = useState(false);
  const [areCommentsLoaded, setAreCommentsLoaded] = useState(false);

  const handleEditorOnChange = (newVal) => {
    setNewCommentText(newVal);
  };
  const handleEditorOnBlur = (newVal) => {
    setNewCommentText(newVal);
  };

  const refreshComments = (successCallback, errorCallback) => {
    setAreCommentsLoaded(false);
    axios
      .get(`/drop/${dropId}/comments`)
      .then((response) => {
        if (response.status === 200) {
          setComments(response.data);
          setAreCommentsLoaded(true);
          successCallback();
        }
      })
      .catch((err) => {
        setAreCommentsLoaded(true);
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
                setAreCommentsLoaded(true);
              }
            })
            .catch((err) => {
              setHasSubmitIssue(false);
              setAreCommentsLoaded(true);
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
          setAreCommentsLoaded(true);
        }
      })
      .catch((err) => {
        setAreCommentsLoaded(true);
      });
  }, [dropId]);

  return (
    <div style={{ minHeight: "50%" }}>
      {!areCommentsLoaded ? (
        <FetchingComments />
      ) : (
        <>
          {comments.length === 0 ? null : (
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
            </>
          )}
          {isAuth ? (
            <>
              {hasSubmitIssue && (
                <Alert variant="danger">
                  There was an issue submitting your comment. Please try again!
                </Alert>
              )}
              <div
                style={{
                  paddingBottom: "2rem",
                  marginRight: "1rem",
                  marginLeft: "1rem",
                }}
              >
                <CommentEditor
                  value={newCommentText}
                  onChange={handleEditorOnChange}
                  onBlur={handleEditorOnBlur}
                  placeHolder="Write new comment here..."
                />
                <Row
                  className="justify-content-end"
                  style={{ paddingTop: "0.5rem", marginRight: "0rem" }}
                >
                  <Button onClick={handleNewCommentSubmit}>
                    Create Comment
                  </Button>
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
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps)(CommentContainer);
