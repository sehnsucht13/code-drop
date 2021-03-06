import { combineReducers } from "redux";
import annotationReducer from "./annotation_reducer";
import editorReducer from "./editor_reducer";
import newDropReducer from "./new_drop_reducer";
import authReducer from "./auth_reducer";

const rootReducer = combineReducers({
  annotationReducer,
  editor: editorReducer,
  newDrop: newDropReducer,
  auth: authReducer,
});

export default rootReducer;
