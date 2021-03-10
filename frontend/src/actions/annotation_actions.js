import {
  DELETE_ANNOTATION,
  ADD_ANNOTATION,
  SAVE_ANNOTATION,
  DELETE_ALL_ANNOTATIONS,
  SET_ANNOTATION_ERROR_STATUS,
} from "../constants/constants";

export function delete_annotation(index) {
  return {
    type: DELETE_ANNOTATION,
    payload: { index: index },
  };
}

export function set_annotation_error_status(index, status) {
  return {
    type: SET_ANNOTATION_ERROR_STATUS,
    payload: { index: index, hasError: status },
  };
}

export function save_annotation(start, end, text, index) {
  return {
    type: SAVE_ANNOTATION,
    payload: { start: start, end: end, text: text, index: index },
  };
}

export function add_annotation(start, end, text, index, dbId) {
  return {
    type: ADD_ANNOTATION,
    payload: { start: start, end: end, text: text, index: index, dbId: dbId },
  };
}

export function delete_all_annotations() {
  return {
    type: DELETE_ALL_ANNOTATIONS,
    payload: null,
  };
}
