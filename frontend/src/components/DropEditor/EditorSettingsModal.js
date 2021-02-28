import React from "react";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import {
  set_editor_font_size,
  set_editor_keymap,
  set_editor_line_wrap,
  set_editor_tab_size,
  set_editor_theme,
} from "../../actions/editor_actions";
import CodeMirrorThemes from "../../helpers/CodeMirrorThemes";

function EditorSettingsModal({
  showModal,
  closeModal,
  theme,
  wrap,
  tabSize,
  fontSize,
  keyMap,
  set_editor_font_size,
  set_editor_keymap,
  set_editor_line_wrap,
  set_editor_tab_size,
  set_editor_theme,
}) {
  const fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  const tabSizes = [2, 4, 8];

  return (
    <Modal show={showModal} onHide={() => closeModal()}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Editor Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Keymap</Form.Label>
            <Form.Control
              as="select"
              defaultValue={keyMap}
              onChange={(ev) => set_editor_keymap(ev.target.value)}
            >
              <option value="default">Default</option>
              <option value="vim">Vim</option>
              <option value="emacs">Emacs</option>
              <option value="sublime">Sublime</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Theme</Form.Label>
            <Form.Control
              as="select"
              defaultValue={theme}
              onChange={(ev) => set_editor_theme(ev.target.value)}
            >
              {CodeMirrorThemes.map((themeName) => (
                <option value={themeName}>{themeName}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Font Size in Pixels</Form.Label>
            <Form.Control
              as="select"
              defaultValue={fontSize}
              onChange={(ev) => set_editor_font_size(ev.target.value)}
            >
              {fontSizes.map((size) => (
                <option value={`${size}px`}>{size}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Line Wrap</Form.Label>
            <Form.Control
              as="select"
              defaultValue={wrap}
              onChange={(ev) =>
                set_editor_line_wrap(ev.target.value === "true")
              }
            >
              <option value={false}>Scroll</option>
              <option value={true}>Wrap</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tab Size</Form.Label>
            <Form.Control
              as="select"
              defaultValue={tabSize}
              onChange={(ev) => set_editor_tab_size(ev.target.value)}
            >
              {tabSizes.map((size) => (
                <option value={size}>{size}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

const mapStateToProps = (state, ownProps) => {
  // console.log("State from modal is", state);
  return {
    theme: state.editor.theme,
    wrap: state.editor.line_wrap,
    tabSize: state.editor.tab_size,
    fontSize: state.editor.font_size,
    keyMap: state.editor.keymap,
    showModal: ownProps.showModal,
    closeModal: ownProps.closeModal,
  };
};

const mapDispatchToProps = {
  set_editor_font_size,
  set_editor_keymap,
  set_editor_line_wrap,
  set_editor_tab_size,
  set_editor_theme,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorSettingsModal);
