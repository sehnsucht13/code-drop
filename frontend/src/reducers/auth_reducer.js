import { CHECKED_AUTH, SET_AUTH, LOGOUT } from "../constants/constants";
const initialState = {
  isAuth: false,
  hasCheckedAuth: false,
  user: undefined,
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHECKED_AUTH:
      return { ...state, ...payload };
    case SET_AUTH:
      return { ...state, ...payload };
    case LOGOUT:
      return { ...state, ...payload };

    default:
      return state;
  }
};

export default authReducer;
