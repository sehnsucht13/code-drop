import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

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
import UploadAlert from "../Alerts/UploadAlert";
import ErrorContainer from "../Error/ErrorContainer";

import {
  reset_drop_info,
  set_drop_visibility,
  set_drop_description,
  set_drop_language,
  set_drop_text,
  set_drop_title_content,
  updateDrop,
  forkDrop,
  uploadEnd,
} from "../../actions/new_drop_actions";
import {
  delete_all_annotations,
  add_annotation,
} from "../../actions/annotation_actions";
import { set_editor_language } from "../../actions/editor_actions";
import { SUCCESS, FETCH_FAIL } from "../../constants/uploadConstants";

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
  forkDrop,
  uploadEnd,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const queryParams = queryString.parse(useLocation().search);
  const [uploadStatusDisplay, setUploadStatusDisplay] = useState(undefined);
  const [hasViewPerm, setHasViewPerm] = useState(true);
  const history = useHistory();

  const handleDiscard = () => {
    reset_drop_info();
    delete_all_annotations();
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/drop/${queryParams.id}`);

        reset_drop_info();

        // Set the editor data with the data of the drop
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
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 404:
            case 401:
              setHasViewPerm(false);
              break;
            case 500:
              setUploadStatusDisplay(FETCH_FAIL);
              break;
            default:
              break;
          }
        }
      }
    }
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.id]);

  useEffect(() => {
    setUploadStatusDisplay(uploadStatus);
    switch (uploadStatus) {
      case SUCCESS:
        setTimeout(() => {
          uploadEnd();
          history.push(`/view?id=${queryParams.id}`);
        }, 1000);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadStatus]);

  const handlePublish = () => {
    if (queryParams.fork === undefined || queryParams.fork === "f") {
      updateDrop(queryParams.id);
    } else {
      forkDrop(queryParams.id);
    }
  };
  if (!hasViewPerm) {
    return (
      <div style={{ height: "100%" }}>
        <Navbar />
        <ErrorContainer />
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ height: "100%" }}>
      <Navbar />
      {!hasLoaded ? (
        <LoadingPage />
      ) : (
        <Container style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
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
  forkDrop,
  uploadEnd,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropEditContainer);
