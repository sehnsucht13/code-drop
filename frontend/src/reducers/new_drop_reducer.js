import {
  SET_DROP_DESC,
  SET_DROP_LANG,
  SET_DROP_TITLE_CONTENT,
  SET_DROP_TITLE_ERROR,
  SET_DROP_VISIBLITY,
  SET_DROP_TEXT,
} from "../constants/constants";

const initialState = {
  title: {
    content: "",
    isInvalid: false,
    errorMsg: undefined,
  },
  description: "",
  visibility: true,
  language: null,
  text: "",
};

// title: {content, isValid, errorMsg}

const new_drop_reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DROP_LANG:
      return { ...state, ...payload };
    case SET_DROP_DESC:
      return { ...state, ...payload };
    case SET_DROP_TITLE_CONTENT:
      return { ...state, title: { ...state.title, content: payload } };
    case SET_DROP_TITLE_ERROR:
      return {
        ...state,
        title: {
          ...state.title,
          isInvalid: payload.isInvalid,
          errorMsg: payload.errorMsg,
        },
      };
    case SET_DROP_VISIBLITY:
      return { ...state, ...payload };
    case SET_DROP_TEXT:
      console.log("Got a drop text action", payload);
      return { ...state, ...payload };
    default:
      return state;
  }
};
export default new_drop_reducer;
