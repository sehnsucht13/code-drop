import {
  SET_ANNOTATION_EDIT_STATUS,
  DELETE_ANNOTATION,
  ADD_ANNOTATION,
  SAVE_ANNOTATION,
  UPLOAD_DROP,
  UPLOAD_DROP_BEGIN,
  UPLOAD_DROP_FAIL,
  UPLOAD_DROP_SUCCESS,
} from "../constants/constants";

const axios = require("axios");

export function set_annotation_edit_status(status, index) {
  return {
    type: SET_ANNOTATION_EDIT_STATUS,
    payload: { status: status, index: index },
  };
}

export function delete_annotation(index) {
  return {
    type: DELETE_ANNOTATION,
    payload: { index: index },
  };
}

export function save_annotation(start, end, text, index) {
  return {
    type: SAVE_ANNOTATION,
    payload: { startLine: start, endLine: end, content: text, index: index },
  };
}

export function add_annotation() {
  return {
    type: ADD_ANNOTATION,
    payload: null,
  };
}

export function uploadSuccess() {
  return {
    type: UPLOAD_DROP_SUCCESS,
    payload: null,
  };
}
export function uploadFail() {
  return {
    type: UPLOAD_DROP_FAIL,
    payload: null,
  };
}
export function uploadBegin() {
  return {
    type: UPLOAD_DROP_BEGIN,
    payload: null,
  };
}

export function sendDrop(title, language, text, visibility) {
  return (dispatch, getState) => {
    dispatch(uploadBegin());
    axios
      .post("/drops", {
        title: title,
        lang: language,
        text: text,
        visibility: visibility,
      })
      .then((response) => {
        console.log(response.status);
        dispatch(uploadSuccess());
      })
      .catch((err) => {
        console.log("Error with post request", err);
        dispatch(uploadFail());
      });
  };
}
