import { combineReducers } from "redux";
import annotationReducer from "./annotation_reducer";

const rootReducer = combineReducers({
  annotationReducer,
});

export default rootReducer;
