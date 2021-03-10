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
            text: payload.text || "",
            start: payload.start || "",
            end: payload.end || "",
            // Indicates if there is an error anywhere within the annotation.
            // If this is true, submission is prevented.
            hasError: false,
            // This is the primary key of the annotation in the database.
            // Used when an annotation is edited or forked.
            dbId: payload.dbId || undefined,
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
            start: payload.start,
            end: payload.end,
            text: payload.text,
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
