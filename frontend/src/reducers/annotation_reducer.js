import {
  DELETE_ANNOTATION,
  SAVE_ANNOTATION,
  ADD_ANNOTATION,
  DELETE_ALL_ANNOTATIONS,
  SET_ANNOTATION_ERROR_STATUS,
} from "../constants/constants";

const default_state = {
  annotations: [],
};

export default function annotationReducer(
  state = default_state,
  { type, payload }
) {
  switch (type) {
    case ADD_ANNOTATION:
      return {
        ...state,
        annotations: [
          ...state.annotations,
          {
            id: state.annotations.length + 1,
            text: "",
            start: "",
            end: "",
            hasError: false,
          },
        ],
      };
    case DELETE_ANNOTATION:
      const newAnnotationStatus = state.annotations.filter((item, index) => {
        if (index === payload.index) {
          return false;
        }
        return true;
      });
      return {
        ...state,
        annotations: newAnnotationStatus,
      };

    case SAVE_ANNOTATION:
      const newAnnotationState = state.annotations.map((item, index) => {
        if (index === payload.index) {
          return {
            ...item,
            start: payload.startLine,
            end: payload.endLine,
            text: payload.content,
          };
        }
        return item;
      });
      return { ...state, annotations: newAnnotationState };
    case DELETE_ALL_ANNOTATIONS:
      return {
        annotations: [],
        hasError: false,
      };
    case SET_ANNOTATION_ERROR_STATUS:
      console.log("Setting annotation status", payload);
      const modifiedAnnotationState = state.annotations.map((item, index) => {
        if (index === payload.index) {
          return {
            ...item,
            hasError: payload.hasError,
          };
        }
        return item;
      });
      return { ...state, annotations: modifiedAnnotationState };
    default:
      return state;
  }
}
