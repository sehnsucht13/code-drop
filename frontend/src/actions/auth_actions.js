import { LOGOUT, CHECKED_AUTH, SET_AUTH } from "../constants/constants";
const axios = require("axios");

export const checked_auth = (payload) => ({
  type: CHECKED_AUTH,
  payload: { hasCheckedAuth: payload },
});

export const set_auth = (authStatus, userObj) => ({
  type: SET_AUTH,
  payload: { isAuth: authStatus, user: userObj },
});

export const logout_success = (authStatus, hasChecked) => ({
  type: LOGOUT,
  payload: { isAuth: authStatus, hasCheckedAuth: hasChecked, user: undefined },
});

export const logout = () => {
  console.log("Called logout");
  return (dispatch, getState) => {
    // TODO: Check for any errors and refuse to send here!
    axios
      .get("/logout")
      .then((response) => {
        console.log("Success when loggin out", response.data);
        dispatch(logout_success(false, false));
        return;
      })
      .catch((err) => {
        console.log("Error when loggin out", err);
      });
  };
};
