import {
  SET_ANNOTATION_EDIT_STATUS,
  DELETE_ANNOTATION,
  ADD_ANNOTATION,
  SAVE_ANNOTATION,
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
