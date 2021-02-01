import { combineReducers } from "redux";
import annotationReducer from "./annotation_reducer";
import editorReducer from "./editor_reducer";

const rootReducer = combineReducers({
  annotationReducer,
  editor: editorReducer,
});

export default rootReducer;
