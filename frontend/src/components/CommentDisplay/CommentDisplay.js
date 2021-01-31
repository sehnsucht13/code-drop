import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

export default function CommentDisplay({
  commentString,
  commentAuthor,
  postDate,
  commentId,
}) {
  console.log(commentString);
  return (
    <div key={commentId}>
      <Row>
        <Col xs={2}>
          <Image src="../../public/logo192.png" rounded />
        </Col>
        <Col xs={2}>{commentAuthor}</Col>
        <Col xs={8}>posted on {postDate}</Col>
      </Row>
      <ReactMarkdown>{commentString}</ReactMarkdown>
    </div>
  );
}
