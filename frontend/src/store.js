import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";

// TODO: Remove this state.
// const initialState = {
//   annotations: [
//     {
//       id: 1,
//       text: "#Hello world",
//       start: 0,
//       end: 2,
//       isEdited: false,
//     },
//   ],
// };

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
