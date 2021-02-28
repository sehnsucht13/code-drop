import {
  SET_DROP_DESC,
  SET_DROP_LANG,
  SET_DROP_TITLE_CONTENT,
  SET_DROP_TITLE_ERROR,
  SET_DROP_VISIBLITY,
  SET_DROP_TEXT,
  UPLOAD_DROP_BEGIN,
  UPLOAD_DROP_FAIL,
  UPLOAD_DROP_SUCCESS,
  UPLOAD_DROP_END,
  SET_NEW_DROP_ID,
  RESET_DROP_INFO,
} from "../constants/constants";
import { START, SUCCESS, FAILURE } from "../constants/uploadConstants";
import { delete_all_annotations } from "./annotation_actions";
import axios from "axios";

export const reset_drop_info = () => ({
  type: RESET_DROP_INFO,
  payload: null,
});

export const set_drop_visibility = (payload) => ({
  type: SET_DROP_VISIBLITY,
  payload: { visibility: payload },
});

export const set_drop_title_content = (payload) => ({
  type: SET_DROP_TITLE_CONTENT,
  payload: { title: payload },
});

export const set_drop_title_error = (payload) => ({
  type: SET_DROP_TITLE_ERROR,
  payload: { hasError: payload },
});

export const set_drop_description = (payload) => ({
  type: SET_DROP_DESC,
  payload: { description: payload },
});

export const set_drop_language = (payload) => ({
  type: SET_DROP_LANG,
  payload: { language: payload },
});

export const set_new_dropId = (payload) => ({
  type: SET_NEW_DROP_ID,
  payload: payload,
});

export const set_drop_text = ({ text, lineCount }) => ({
  type: SET_DROP_TEXT,
  payload: { editorText: text, editorLineCount: lineCount },
});

export function uploadSuccess() {
  return {
    type: UPLOAD_DROP_SUCCESS,
    payload: SUCCESS,
  };
}

export function uploadFail() {
  return {
    type: UPLOAD_DROP_FAIL,
    payload: FAILURE,
  };
}

export function uploadBegin() {
  return {
    type: UPLOAD_DROP_BEGIN,
    payload: START,
  };
}

export function uploadEnd() {
  return {
    type: UPLOAD_DROP_END,
    payload: null,
  };
}

export function sendDrop() {
  return (dispatch, getState) => {
    const annotationArray = getState().annotationReducer.annotations;
    const dropText = getState().newDrop.editorText;
    const dropLang = getState().newDrop.language;
    const dropTitle = getState().newDrop.title.content;
    const dropDesc = getState().newDrop.description;
    const dropVisibility = getState().newDrop.visibility;
    if (dropTitle.length === 0) {
      dispatch(
        set_drop_title_error({
          errorMsg: "Title cannot be empty!",
          isInvalid: true,
        })
      );
      return;
    }

    dispatch(uploadBegin());
    axios
      .post("/drop", {
        title: dropTitle,
        lang: dropLang,
        text: dropText,
        description: dropDesc,
        visibility: dropVisibility,
        annotations: annotationArray,
      })
      .then((response) => {
        // Erase data from store
        dispatch(reset_drop_info());
        dispatch(delete_all_annotations());
        dispatch(set_new_dropId(response.data.id));
        dispatch(uploadSuccess());
      })
      .catch((err) => {
        dispatch(uploadFail());
      });
  };
}

export function updateDrop(dropId) {
  return (dispatch, getState) => {
    const annotationArray = getState().annotationReducer.annotations.map(
      (annotation) => {
        return {
          start: annotation.start,
          end: annotation.end,
          text: annotation.text,
          dbId: annotation.dbId,
        };
      }
    );
    const dropText = getState().newDrop.editorText;
    const dropLang = getState().newDrop.language;
    const dropTitle = getState().newDrop.title.content;
    const dropDesc = getState().newDrop.description;
    const dropVisibility = getState().newDrop.visibility;
    if (dropTitle.length === 0) {
      dispatch(
        set_drop_title_error({
          errorMsg: "Title cannot be empty!",
          isInvalid: true,
        })
      );
      return;
    }

    // TODO: Check for any errors and refuse to send here!
    dispatch(uploadBegin());
    axios
      .put(`/drop/${dropId}`, {
        title: dropTitle,
        lang: dropLang,
        text: dropText,
        description: dropDesc,
        visibility: dropVisibility,
        annotations: annotationArray,
      })
      .then((response) => {
        // Erase data from store
        dispatch(reset_drop_info());
        dispatch(delete_all_annotations());
        dispatch(uploadSuccess());
      })
      .catch((err) => {
        dispatch(uploadFail());
      });
  };
}

export function forkDrop(parentDropId) {
  return (dispatch, getState) => {
    const annotationArray = getState().annotationReducer.annotations;
    const dropText = getState().newDrop.editorText;
    const dropLang = getState().newDrop.language;
    const dropTitle = getState().newDrop.title.content;
    const dropDesc = getState().newDrop.description;
    const dropVisibility = getState().newDrop.visibility;
    if (dropTitle.length === 0) {
      dispatch(
        set_drop_title_error({
          errorMsg: "Title cannot be empty!",
          isInvalid: true,
        })
      );
      return;
    }

    // TODO: Check for any errors and refuse to send here!
    dispatch(uploadBegin());
    axios
      .post("/drop", {
        title: dropTitle,
        lang: dropLang,
        text: dropText,
        description: dropDesc,
        visibility: dropVisibility,
        annotations: annotationArray,
        isForked: true,
        parentId: parentDropId,
      })
      .then((response) => {
        // Erase data from store
        dispatch(reset_drop_info());
        dispatch(delete_all_annotations());
        dispatch(uploadSuccess());
      })
      .catch((err) => {
        dispatch(uploadFail());
      });
  };
}
