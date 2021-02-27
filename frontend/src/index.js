import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import store from "./store";
import App from "./App";
import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'production'? 'https://code-drop.herokuapp.com/api': 'http://localhost:3000';

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
