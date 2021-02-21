import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Button, Container } from "react-bootstrap";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import axios from "axios";

import CodeMirrorLanguages from "../../helpers/CodeMirrorLanguages";
import DropEditor from "../DropEditor/DropEditor";
import DropInput from "../DropEditor/DropInput";
import AnnotationContainer from "../CodeAnnotation/AnnotationContainer";
import Navbar from "../NavBar/Navbar";
import {
  reset_drop_info,
  set_drop_visibility,
  set_drop_description,
  set_drop_language,
  set_drop_text,
  set_drop_title_content,
} from "../../actions/new_drop_actions";
import {
  delete_all_annotations,
  add_annotation,
  save_annotation,
} from "../../actions/annotation_actions";
import { set_editor_language } from "../../actions/editor_actions";

export const DropEditContainer = ({
  reset_drop_info,
  set_drop_visibility,
  set_drop_description,
  set_drop_language,
  set_drop_text,
  set_drop_title_content,
  delete_all_annotations,
  add_annotation,
  save_annotation,
  set_editor_language,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const queryParams = queryString.parse(useLocation().search);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/drop/${queryParams.id}`);
        console.log("Got a response with data", response);

        // Set the editor data with the data of the drop
        //await reset_drop_info();
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
          add_annotation();
          save_annotation(
            annotation.startLine,
            annotation.endLine,
            annotation.annotation_text,
            index
          );
        });
        setHasLoaded(true);
      } catch {
        console.log("Error with this");
      }
    }
    getData();
  }, [queryParams.id]);

  return (
    <div>
      <Navbar />
      {hasLoaded && (
        <Container style={{ paddingTop: "5%" }}>
          <Row className="justify-content-end">
            <Button onClick={() => {}}>Publish</Button>
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
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log("State is", state);
};

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
  save_annotation,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropEditContainer);
