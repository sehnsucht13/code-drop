import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { sendDrop } from "../../actions/annotation_actions";
import CodeMirrorLanguages from "../../helpers/CodeMirrorLanguages";
import EditorSettingsModal from "./EditorSettingsModal";
import { BsGear } from "react-icons/bs";

import DropEditor from "./DropEditor";

function CodeDropEditor({ uploadDrop }) {
  const [language, setLanguage] = useState(null);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState(true);

  const [showEditorOptions, setShowEditorOptions] = useState(false);

  const handleLanguageSelect = (ev) => {
    console.log(ev.target.value, CodeMirrorLanguages[ev.target.value]);
    setLanguage(CodeMirrorLanguages[ev.target.value]);
  };

  const handleDropNameChange = (ev) => setTitle(ev.target.value);

  const handleVisibility = (ev) => setVisibility(ev.target.value);

  const handleCloseModal = () => setShowEditorOptions(false);

  return (
    <div>
      <EditorSettingsModal
        showModal={showEditorOptions}
        closeModal={handleCloseModal}
      />

      <Row className="justify-content-end">
        <Button onClick={() => uploadDrop(title, language, visibility)}>
          Publish
        </Button>
        <Button>Discard</Button>
      </Row>

      <Form>
        <Form.Group>
          <Form.Label srOnly>Code-Drop Name:</Form.Label>
          <Form.Control
            placeholder="Name..."
            value={title}
            onChange={handleDropNameChange}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label srOnly>Description:</Form.Label>
          <Form.Control
            placeholder="Description..."
            value={title}
            onChange={handleDropNameChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group as={Row}>
          <Col md={6}>
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              defaultValue="Choose..."
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
              defaultValue="Public"
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

        <hr style={{ height: 2 }} />
      </Form>
      <DropEditor />
      <hr style={{ height: 2 }} />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadDrop: (dropTitle, dropLanguage, dropText, visibility) =>
      dispatch(sendDrop(dropTitle, dropLanguage, dropText, visibility)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeDropEditor);
