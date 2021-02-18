import {
  DELETE_ANNOTATION,
  SAVE_ANNOTATION,
  SET_ANNOTATION_EDIT_STATUS,
  ADD_ANNOTATION,
} from "../constants/constants";

const default_state = {
  annotations: [],
  isError: false,
  isSending: false,
  sendSuccess: false,
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
            isEdited: false,
            // shouldFocus
          },
        ],
      };
    case SET_ANNOTATION_EDIT_STATUS:
      console.log("Got an edit status message");
      const newAnnotationArr = state.annotations.map((item, index) => {
        if (index === payload.index) {
          return { ...item, isEdited: payload.status };
        }
        return item;
      });
      return {
        ...state,
        annotations: newAnnotationArr,
      };
    case DELETE_ANNOTATION:
      console.log("Got a delete");
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
            isEdited: false,
          };
        }
        return item;
      });
      console.log(newAnnotationState);
      return { ...state, annotations: newAnnotationState };
    default:
      console.log("default case");
      return state;
  }
}
