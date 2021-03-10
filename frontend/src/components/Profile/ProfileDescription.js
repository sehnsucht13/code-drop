import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import { BsPencilSquare } from "react-icons/bs";
import axios from "axios";

function ProfileDescription({ description, allowEdit, userId }) {
  const [currentDescription, setCurrentDescription] = useState(description);
  const [toggleDescriptionEdit, setToggleDescriptionEdit] = useState(false);
  const [newDescriptionValue, setNewDescriptionValue] = useState(description);

  const [hasUploadError, setHasUploadError] = useState(false);

  const handleDescriptionEditClick = () => {
    setToggleDescriptionEdit(true);
  };

  const hideDescriptionEdit = () => {
    setNewDescriptionValue(description);
    setToggleDescriptionEdit(false);
  };

  const handleDescriptionChange = (e) => {
    setNewDescriptionValue(e.target.value);
  };

  const updateProfile = () => {
    axios
      .put(`/user/${userId}/profile/description`, {
        description: newDescriptionValue,
      })
      .then((resp) => {
        setHasUploadError(false);
        setCurrentDescription(newDescriptionValue);
        setToggleDescriptionEdit(false);
      })
      .catch((err) => {
        console.error(err);
        setHasUploadError(true);
      });
  };

  if (toggleDescriptionEdit) {
    return (
      <>
        {hasUploadError && (
          <Alert variant="danger">
            There was an upload issue. Please try again!
          </Alert>
        )}
        <Form>
          <FormControl
            as="textarea"
            rows={3}
            value={newDescriptionValue}
            onChange={handleDescriptionChange}
            style={{
              width: "100%",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          ></FormControl>
          <Row className="justify-content-end">
            <Button
              style={{ marginTop: "0.2rem", marginRight: "0.3rem" }}
              onClick={hideDescriptionEdit}
            >
              Discard
            </Button>
            <Button
              style={{ marginTop: "0.2rem", marginEnd: "1rem" }}
              onClick={updateProfile}
            >
              Update
            </Button>
          </Row>
        </Form>
      </>
    );
  } else {
    return (
      <>
        <p style={{ marginBottom: "0" }}>{currentDescription}</p>
        {allowEdit && (
          <Row className="justify-content-end">
            <Button
              variant="secondary"
              style={{ marginTop: "0.0rem", marginRight: "1rem" }}
              onClick={handleDescriptionEditClick}
            >
              <BsPencilSquare />{" "}
            </Button>
          </Row>
        )}
      </>
    );
  }
}

export default ProfileDescription;
