import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore } from "redux";
import { Provider } from "react-redux";

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
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
