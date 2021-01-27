import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// TODO: Move these to separate files.
const miniReducer = (state = {}, { type, payload }) => {
  console.log("From reducer", type, payload, state);
  switch (type) {
    case "NEW_ANNOTATION":
      console.log("got a  new");
      return {
        ...state,
        annotations: [
          ...state.annotations,
          {
            id: state.annotations.length + 1,
            text: "",
            start: null,
            end: null,
            isEdited: false,
          },
        ],
      };
    case "SET_EDIT_STATUS":
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
    case "DELETE_ANNOTATION":
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

    case "SAVE_ANNOTATION_STATE":
      const newAnnotationState = state.annotations.map((item, index) => {
        if (index === payload.index) {
          return {
            ...item,
            start: payload.startLine,
            end: payload.endLine,
            text: payload.text,
            isEdited: false,
          };
        }
        return item;
      });
      return { ...state, annotations: newAnnotationState };
    default:
      console.log("default case");
  }
  return state;
};

const initialState = {
  annotations: [
    {
      id: 1,
      text: "#Hello world",
      start: 0,
      end: 2,
      isEdited: false,
    },
  ],
};

const store = createStore(miniReducer, initialState);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
