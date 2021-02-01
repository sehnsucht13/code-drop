import React, { useState } from "react";
import { connect } from "react-redux";
import { Form, FormControl, Row, Col, Button } from "react-bootstrap";
import { BsGear } from "react-icons/bs";
import CodeMirrorLanguages from "../../helpers/CodeMirrorLanguages";
import EditorSettingsModal from "./EditorSettingsModal";
import {
  set_drop_description,
  set_drop_language,
  set_drop_title,
  set_drop_visibility,
} from "../../actions/new_drop_actions";
import { set_editor_language } from "../../actions/editor_actions";

export const DropInput = ({
  set_drop_description,
  set_drop_language,
  set_drop_title,
  set_drop_visibility,
  set_editor_language,
  language,
  visibility,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTitleinValid, setIsTitleInvalid] = useState(false);

  const [showEditorOptions, setShowEditorOptions] = useState(false);

  const handleDropTitleChange = (ev) => setTitle(ev.target.value);
  const handleDescriptionChange = (ev) => setDescription(ev.target.value);

  const handleDropTitleBlur = () => {
    if (title.length === 0) {
      setIsTitleInvalid(true);
    }
    set_drop_title(title);
  };
  const handleDescriptionBlur = (ev) => set_drop_description(description);

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
            placeholder="Name..."
            value={title}
            onChange={handleDropTitleChange}
            onBlur={handleDropTitleBlur}
            isInvalid={isTitleinValid}
            maxLength="200"
          ></Form.Control>
          <FormControl.Feedback type="invalid">
            Drop title cannot be empty!
          </FormControl.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label srOnly>Description:</Form.Label>
          <Form.Control
            placeholder="Description..."
            value={description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
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
    visibility: state.newDrop.visibility,
    language: state.newDrop.language,
  };
};

const mapDispatchToProps = {
  set_drop_description,
  set_drop_language,
  set_drop_title,
  set_drop_visibility,
  set_editor_language,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropInput);
