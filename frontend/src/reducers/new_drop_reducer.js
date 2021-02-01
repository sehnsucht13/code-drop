import {
  SET_DROP_DESC,
  SET_DROP_LANG,
  SET_DROP_TITLE,
  SET_DROP_VISIBLITY,
} from "../constants/constants";

const initialState = {
  title: "",
  description: "",
  visibility: true,
  language: null,
};

const new_drop_reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DROP_LANG:
      return { ...state, ...payload };
    case SET_DROP_DESC:
      return { ...state, ...payload };
    case SET_DROP_TITLE:
      return { ...state, ...payload };
    case SET_DROP_VISIBLITY:
      return { ...state, ...payload };
    default:
      return state;
  }
};
export default new_drop_reducer;
