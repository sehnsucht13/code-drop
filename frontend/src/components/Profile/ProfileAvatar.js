import React, { useState } from "react";
import axios from "axios";

import Image from "react-bootstrap/Image";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsPencilSquare } from "react-icons/bs";

function ProfileAvatar({ avatar, allowEdit, userId }) {
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [toggleAvatarEdit, setToggleAvatarEdit] = useState(false);
  const [avatarSource, setAvatarSource] = useState(avatar);

  const [hasUploadError, setHasUploadError] = useState(false);

  const handleSubmitAvatar = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    axios
      .post(`/user/${userId}/profile/avatar`, formData)
      .then((resp) => {
        setHasUploadError(false);
        setAvatarSource(resp.data.avatarURL);
        setToggleAvatarEdit(false);
      })
      .catch((err) => {
        console.error("error uploading", err);
        setHasUploadError(true);
      });
  };

  const handleAvatarFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const toggleEdit = () => {
    setToggleAvatarEdit(true);
  };

  const hideEdit = () => {
    setToggleAvatarEdit(false);
  };

  return (
    <div>
      <div>
        <Image rounded fluid src={avatarSource} />
      </div>
      {hasUploadError && (
        <Alert variant="danger">
          There was an upload issue. Please try again!
        </Alert>
      )}
      {allowEdit && !toggleAvatarEdit && (
        <Row className="justify-content-end">
          <Button
            variant="secondary"
            style={{ marginTop: "0.3rem", marginRight: "1rem" }}
            onClick={toggleEdit}
          >
            <BsPencilSquare />{" "}
          </Button>
        </Row>
      )}
      {toggleAvatarEdit && (
        <Form onSubmit={handleSubmitAvatar}>
          <Form.Group>
            <Form.File
              id="exampleFormControlFile1"
              label="Choose New Avatar Image"
              onChange={handleAvatarFileChange}
              accept="image/png image/jpg image/jpeg"
            />
          </Form.Group>

          <Row className="justify-content-end">
            <Button
              style={{ marginTop: "0.2rem", marginRight: "0.3rem" }}
              onClick={hideEdit}
            >
              Discard
            </Button>
            <Button
              style={{ marginTop: "0.2rem", marginEnd: "1rem" }}
              type="submit"
            >
              Update
            </Button>
          </Row>
        </Form>
      )}
    </div>
  );
}

export default ProfileAvatar;
