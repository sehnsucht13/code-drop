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
  return (dispatch, getState) => {
    // TODO: Check for any errors and refuse to send here!
    axios
      .get("/auth/logout")
      .then((response) => {
        dispatch(logout_success(false, false));
        return;
      })
      .catch((err) => {
        console.error("Error when loggin out", err);
      });
  };
};
