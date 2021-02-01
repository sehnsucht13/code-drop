import React, { useState } from "react";
import { Form, Row, Col, Modal } from "react-bootstrap";

import CodeMirrorThemes from "../../helpers/CodeMirrorThemes";

function EditorSettingsModal({ showModal, closeModal }) {
  console.log("Got status from modal", showModal);
  return (
    <Modal show={showModal} onHide={() => closeModal()}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Editor Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Keymap</Form.Label>
            <Form.Control as="select">
              <option>Default</option>
              <option>Vim</option>
              <option>Emacs</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Theme</Form.Label>
            <Form.Control as="select">
              {CodeMirrorThemes.map((themeName) => (
                <option value={themeName}>{themeName}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Font Size in Pixels</Form.Label>
            <Form.Control as="select">
              {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((size) => (
                <option value={size}>{size}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Line Wrap</Form.Label>
            <Form.Control as="select">
              <option>Scroll</option>
              <option>Wrap</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Tab Size</Form.Label>
            <Form.Control as="select">
              {[2, 4, 8].map((size) => (
                <option value={size}>{size}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditorSettingsModal;
