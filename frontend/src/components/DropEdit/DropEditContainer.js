import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Button, Container, Alert } from "react-bootstrap";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

import CodeMirrorLanguages from "../../helpers/CodeMirrorLanguages";
import DropEditor from "../DropEditor/DropEditor";
import DropInput from "../DropEditor/DropInput";
import AnnotationContainer from "../CodeAnnotation/AnnotationContainer";
import Navbar from "../NavBar/Navbar";
import LoadingPage from "../Loading/LoadingPage";
import Footer from "../Footer/Footer";

import {
  reset_drop_info,
  set_drop_visibility,
  set_drop_description,
  set_drop_language,
  set_drop_text,
  set_drop_title_content,
  updateDrop,
} from "../../actions/new_drop_actions";
import {
  delete_all_annotations,
  add_annotation,
} from "../../actions/annotation_actions";
import { set_editor_language } from "../../actions/editor_actions";
import { SUCCESS, FAILURE } from "../../constants/uploadConstants";

export const DropEditContainer = ({
  reset_drop_info,
  set_drop_visibility,
  set_drop_description,
  set_drop_language,
  set_drop_text,
  set_drop_title_content,
  delete_all_annotations,
  add_annotation,
  set_editor_language,
  updateDrop,
  uploadStatus,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasUploadError, setHasUploadError] = useState(undefined);
  const queryParams = queryString.parse(useLocation().search);
  const history = useHistory();

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/drop/${queryParams.id}`);
        console.log("Got a response with data", response);

        // Set the editor data with the data of the drop
        reset_drop_info();
        set_drop_language(response.data.codeDrop.lang);
        set_drop_text({
          text: response.data.codeDrop.text,
          lineCount: undefined,
        });
        set_drop_title_content(response.data.codeDrop.title);
        set_drop_description(response.data.codeDrop.description);
        set_drop_visibility(response.data.codeDrop.visibility);
        set_editor_language(CodeMirrorLanguages[response.data.codeDrop.lang]);
        delete_all_annotations();

        response.data.dropAnnotations.forEach((annotation, index) => {
          add_annotation(
            annotation.startLine,
            annotation.endLine,
            annotation.annotation_text,
            index,
            annotation.id
          );
        });
        setHasLoaded(true);
      } catch {
        // TODO: Error handling if there is an issue
        console.log("Error retrieving data.");
      }
    }
    getData();
  }, [queryParams.id]);

  useEffect(() => {
    switch (uploadStatus) {
      case SUCCESS:
        setTimeout(() => {
          history.push(`/view?id=${queryParams.id}`);
        }, 1000);
        setHasUploadError(false);
        break;
      case FAILURE:
        setHasUploadError(true);
        break;
      default:
        break;
    }
  }, [uploadStatus]);

  const handlePublish = () => {
    if (queryParams.fork === undefined || queryParams.fork === "f") {
      updateDrop(queryParams.id);
    } else {
      // Handle case of fork
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <Navbar />
      {!hasLoaded ? (
        <LoadingPage />
      ) : (
        <Container style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
          {hasUploadError === true && (
            <Alert variant="danger">
              There was an issue with uploading. Please try submitting again
            </Alert>
          )}
          {hasUploadError === false && (
            <Alert variant="success">Success! Redirecting...</Alert>
          )}
          <Row className="justify-content-end">
            <Button onClick={handlePublish}>Publish</Button>
            <Button>Discard</Button>
          </Row>
          <hr style={{ height: 2 }} />
          <DropInput />
          <hr style={{ height: 2 }} />
          <DropEditor />
          <hr style={{ height: 2 }} />
          <AnnotationContainer />
        </Container>
      )}
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  uploadStatus: state.newDrop.uploadStatus,
});

const mapDispatchToProps = {
  reset_drop_info,
  set_drop_visibility,
  set_drop_description,
  set_drop_language,
  set_drop_text,
  set_drop_title_content,
  delete_all_annotations,
  add_annotation,
  set_editor_language,
  updateDrop,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropEditContainer);
