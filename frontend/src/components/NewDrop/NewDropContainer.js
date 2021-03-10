import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import DropEditor from "../DropEditor/DropEditor";
import DropInput from "../DropEditor/DropInput";
import AnnotationContainer from "../CodeAnnotation/AnnotationContainer";
import Navbar from "../NavBar/Navbar";
import UploadAlert from "../Alerts/UploadAlert";
import Footer from "../Footer/Footer";

import {
  reset_drop_info,
  sendDrop,
  uploadEnd,
} from "../../actions/new_drop_actions";
import { delete_all_annotations } from "../../actions/annotation_actions";
import { SUCCESS } from "../../constants/uploadConstants";

function CodeDropEditor({
  sendDrop,
  uploadEnd,
  reset_drop_info,
  delete_all_annotations,
  uploadStatus,
  newDropId,
}) {
  const history = useHistory();
  const [uploadStatusDisplay, setUploadStatusDisplay] = useState(undefined);
  const handleDiscard = () => {
    delete_all_annotations();
    reset_drop_info();
  };

  const handlePublish = () => {
    sendDrop();
  };

  useEffect(() => {
    setUploadStatusDisplay(uploadStatus);
    if (uploadStatus === SUCCESS) {
      setTimeout(() => {
        uploadEnd();
        history.push(`/view?id=${newDropId}`);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadStatus]);

  return (
    <>
      <Navbar />
      <Container
        style={{ paddingTop: "1rem", paddingBottom: "1rem", minHeight: "80%" }}
      >
        {uploadStatusDisplay !== undefined && (
          <UploadAlert type={uploadStatusDisplay} />
        )}
        <Row className="justify-content-end" style={{ paddingRight: "1rem" }}>
          <Button onClick={handlePublish} style={{ marginRight: "0.5rem" }}>
            Publish
          </Button>
          <Button onClick={handleDiscard}>Discard</Button>
        </Row>
        <hr style={{ height: 2, marginTop: "0.5rem" }} />
        <DropInput />
        <hr style={{ height: 2 }} />
        <DropEditor />
        <hr style={{ height: 2 }} />
        <AnnotationContainer />
      </Container>
      <Footer />
    </>
  );
}

const mapStateToProps = (state, ownProps) => ({
  uploadStatus: state.newDrop.uploadStatus,
  newDropId: state.newDrop.newDropId,
});

const mapDispatchToProps = {
  reset_drop_info,
  delete_all_annotations,
  sendDrop,
  uploadEnd,
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropEditor);
