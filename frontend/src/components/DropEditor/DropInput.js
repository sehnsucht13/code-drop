import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Form, FormControl, Row, Col, Button } from "react-bootstrap";
import { BsGear } from "react-icons/bs";
import CodeMirrorLanguages from "../../helpers/CodeMirrorLanguages";
import EditorSettingsModal from "./EditorSettingsModal";
import {
  set_drop_description,
  set_drop_language,
  set_drop_title_content,
  set_drop_title_error,
  set_drop_visibility,
} from "../../actions/new_drop_actions";
import { set_editor_language } from "../../actions/editor_actions";

export const DropInput = ({
  set_drop_description,
  set_drop_language,
  set_drop_title_content,
  set_drop_title_error,
  set_drop_visibility,
  set_editor_language,
  title,
  description,
  language,
  visibility,
}) => {
  const [titleContent, setTitleContent] = useState(title.content);
  const [descriptionContent, setDescriptionContent] = useState(description);

  const [isTitleInvalid, setIsTitleInvalid] = useState(false);
  const [titleErrMsg, setTitleErrMsg] = useState(undefined);

  const [showEditorOptions, setShowEditorOptions] = useState(false);

  useEffect(() => {
    setIsTitleInvalid(title.isInvalid);
  }, [title]);

  const handleDropTitleChange = (ev) => setTitleContent(ev.target.value);
  const handleDescriptionChange = (ev) =>
    setDescriptionContent(ev.target.value);

  const handleDropTitleBlur = () => {
    console.log("Here is the title", titleContent);
    if (titleContent.length === 0) {
      set_drop_title_error({ errorMsg: undefined, isInvalid: true });
      set_drop_title_content(titleContent);
    } else {
      set_drop_title_error({ errorMsg: undefined, isInvalid: false });
      set_drop_title_content(titleContent);
    }
  };
  const handleDescriptionBlur = () => set_drop_description(descriptionContent);
  const handleVisibility = (ev) => set_drop_visibility(ev.target.value);

  const handleLanguageSelect = (ev) => {
    set_editor_language(CodeMirrorLanguages[ev.target.value]);
    set_drop_language(ev.target.value);
  };

  const handleCloseModal = () => setShowEditorOptions(false);
  return (
    <div>
      <EditorSettingsModal
        showModal={showEditorOptions}
        closeModal={handleCloseModal}
      />
      <Form>
        <Form.Group>
          <Form.Label srOnly>Code-Drop Name:</Form.Label>
          <Form.Control
            placeholder="Title..."
            value={titleContent}
            onChange={handleDropTitleChange}
            onBlur={handleDropTitleBlur}
            isInvalid={isTitleInvalid}
            minLength="1"
            maxLength="90"
          ></Form.Control>
          <FormControl.Feedback type="invalid">
            Drop title cannot be empty!
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label srOnly>Description:</Form.Label>
          <Form.Control
            placeholder="Description..."
            value={descriptionContent}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            minLength="0"
            maxLength="300"
          ></Form.Control>
        </Form.Group>

        <Form.Group as={Row}>
          <Col md={6}>
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              defaultValue={language}
              onChange={handleLanguageSelect}
            >
              {Object.keys(CodeMirrorLanguages).map((key) => {
                return <option value={key}>{key}</option>;
              })}
            </Form.Control>
          </Col>
          <Col md={5}>
            <Form.Label>Visibility</Form.Label>
            <Form.Control
              as="select"
              defaultValue={visibility}
              onChange={handleVisibility}
            >
              <option value={true}>Public</option>
              <option value={false}>Private</option>
            </Form.Control>
          </Col>
          <Col md={1} className="d-flex justify-content-end align-items-end">
            <Button onClick={() => setShowEditorOptions(true)}>
              <BsGear size={25} />
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.newDrop.title,
    description: state.newDrop.description,
    visibility: state.newDrop.visibility,
    language: state.newDrop.language,
  };
};

const mapDispatchToProps = {
  set_drop_description,
  set_drop_language,
  set_drop_title_content,
  set_drop_title_error,
  set_drop_visibility,
  set_editor_language,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropInput);
