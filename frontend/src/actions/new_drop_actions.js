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
} from "../constants/constants";
const axios = require("axios");

export const set_drop_visibility = (payload) => ({
  type: SET_DROP_VISIBLITY,
  payload: { visibility: payload },
});

export const set_drop_title_content = (payload) => ({
  type: SET_DROP_TITLE_CONTENT,
  payload: { title: payload },
});

export const set_drop_title_error = ({ errorMsg, isInvalid }) => ({
  type: SET_DROP_TITLE_ERROR,
  payload: { errorMsg: errorMsg, isInvalid: isInvalid },
});

export const set_drop_description = (payload) => ({
  type: SET_DROP_DESC,
  payload: { description: payload },
});

export const set_drop_language = (payload) => ({
  type: SET_DROP_LANG,
  payload: { language: payload },
});

export const set_drop_text = (payload) => ({
  type: SET_DROP_TEXT,
  payload: { text: payload },
});

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

export function sendDrop() {
  return (dispatch, getState) => {
    const annotationArray = getState().annotationReducer.annotations;
    const dropText = getState().newDrop.text;
    const dropLang = getState().newDrop.language;
    const dropTitle = getState().newDrop.title.content.title;
    const dropDesc = getState().newDrop.description;
    const dropVisibility = getState().newDrop.visibility;
    console.log("About to send state", annotationArray, getState().newDrop);
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
      })
      .then((response) => {
        console.log(response.data);
        dispatch(uploadSuccess());
      })
      .catch((err) => {
        console.log("Error with post request when uploading", err);
        dispatch(uploadFail());
      });
  };
}
