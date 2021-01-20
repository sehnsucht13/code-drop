import React from "react";
import { Container } from "react-bootstrap";
import CommentDisplay from "./CommentDisplay";
import CommentEditor from "./CommentEditor";

const sampleComments = [
  {
    id: "1",
    text: `# Here is a title

    Here is a comment`,
    author: "TestUser1",
    datePosted: "today",
  },
  {
    id: "2",
    text: `# Here is a title

    Here is a comment with some more stuff *like bold*`,
    author: "TestUser2",
    datePosted: "19-3-2020",
  },
];

export default function CommentContainer() {
  return (
    <Container>
      {sampleComments.map((comment) => (
        <CommentDisplay
          commentString={comment.text}
          commentAuthor={comment.author}
          datePosted={comment.datePosted}
          commentId={comment.id}
        />
      ))}
      <CommentEditor />
    </Container>
  );
}
