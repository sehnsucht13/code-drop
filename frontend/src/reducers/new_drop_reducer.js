import {
  SET_DROP_DESC,
  SET_DROP_LANG,
  SET_DROP_TITLE_CONTENT,
  SET_DROP_TITLE_ERROR,
  SET_DROP_VISIBLITY,
  SET_DROP_TEXT,
  SET_NEW_DROP_ID,
  RESET_DROP_INFO,
  UPLOAD_DROP_SUCCESS,
  UPLOAD_DROP_BEGIN,
  UPLOAD_DROP_FAIL,
  UPLOAD_DROP_END,
} from "../constants/constants";

const initialState = {
  title: {
    content: "",
    hasError: false, // Prevents submission if there is an error in the title
  },
  description: "",
  visibility: true,
  language: null,
  editorText: "", // Contents of the editor
  editorLineCount: 0, // Number of lines in the editor. Used by annotations to find errors
  uploadStatus: undefined,
  newDropId: undefined,
};

const new_drop_reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DROP_LANG:
      return { ...state, ...payload };
    case SET_DROP_DESC:
      return { ...state, ...payload };
    case SET_DROP_TITLE_CONTENT:
      return { ...state, title: { ...state.title, content: payload.title } };
    case SET_DROP_TITLE_ERROR:
      return {
        ...state,
        title: {
          ...state.title,
          ...payload,
        },
      };
    case SET_DROP_VISIBLITY:
      return { ...state, ...payload };
    case SET_DROP_TEXT:
      return { ...state, ...payload };
    case RESET_DROP_INFO:
      return {
        title: {
          content: "",
          hasError: false,
        },
        description: "",
        visibility: true,
        language: null,
        editorText: "",
        editorLineCount: 0,
        uploadStatus: undefined,
      };
    case UPLOAD_DROP_SUCCESS:
      return {
        ...state,
        uploadStatus: payload,
      };
    case UPLOAD_DROP_FAIL:
      return {
        ...state,
        uploadStatus: payload,
      };
    case UPLOAD_DROP_END:
      return {
        ...state,
        uploadStatus: undefined,
      };
    case UPLOAD_DROP_BEGIN:
      return {
        ...state,
        uploadStatus: payload,
      };
    case SET_NEW_DROP_ID:
      return {
        ...state,
        newDropId: payload,
      };
    default:
      return state;
  }
};
export default new_drop_reducer;
