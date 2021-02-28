import React from "react";
import { connect } from "react-redux";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import DropEditor from "../DropEditor/DropEditor";
import DropInput from "../DropEditor/DropInput";
import AnnotationContainer from "../CodeAnnotation/AnnotationContainer";
import Navbar from "../NavBar/Navbar";

import { sendDrop } from "../../actions/new_drop_actions";

function CodeDropEditor({ sendDrop }) {
  return (
    <>
      <Navbar />
      <Container style={{ paddingTop: "5%" }}>
        <Row className="justify-content-end">
          <Button
            onClick={() => {
              sendDrop();
            }}
          >
            Publish
          </Button>
          <Button>Discard</Button>
        </Row>
        <hr style={{ height: 2 }} />
        <DropInput />
        <hr style={{ height: 2 }} />
        <DropEditor />
        <hr style={{ height: 2 }} />
        <AnnotationContainer />
      </Container>
    </>
  );
}

const mapStateToProps = (state, ownProps) => {};

const mapDispatchToProps = {
  sendDrop,
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropEditor);
