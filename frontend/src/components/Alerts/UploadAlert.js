import React from "react";
import Alert from "react-bootstrap/Alert";
import {
  START,
  FAILURE,
  SUCCESS,
  FETCH_FAIL,
} from "../../constants/uploadConstants";

function UploadAlert({ type }) {
  switch (type) {
    case START:
      return <Alert variant="info">Uploading Drop...</Alert>;
    case FETCH_FAIL:
      return (
        <Alert variant="info">
          Failed to retrieve drop. Please refresh the page.
        </Alert>
      );
    case FAILURE:
      return (
        <Alert variant="danger">Failed to upload drop. Please try again.</Alert>
      );
    case SUCCESS:
      return (
        <Alert variant="success">
          Drop uploaded successfully. Redirecting...
        </Alert>
      );
    default:
      break;
  }
}

export default UploadAlert;
