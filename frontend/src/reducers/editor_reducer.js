import {
  SET_EDITOR_THEME,
  SET_EDITOR_LANG,
  SET_EDITOR_FONT_SIZE,
  SET_EDITOR_KEYMAP,
  SET_EDITOR_TAB_SIZE,
  SET_EDITOR_LINE_WRAP,
  SET_EDITOR_INSTANCE,
} from "../constants/constants";

const default_editor_state = {
  theme: "default",
  keymap: "default",
  font_size: "12px",
  line_wrap: false,
  tab_size: 4,
  language: null,
  instance: undefined,
};

const editor_reducer = (state = default_editor_state, { type, payload }) => {
  switch (type) {
    case SET_EDITOR_THEME:
      return { ...state, ...payload };
    case SET_EDITOR_LANG:
      return { ...state, ...payload };
    case SET_EDITOR_FONT_SIZE:
      return { ...state, ...payload };
    case SET_EDITOR_INSTANCE:
      return { ...state, ...payload };
    case SET_EDITOR_KEYMAP:
      return { ...state, ...payload };
    case SET_EDITOR_TAB_SIZE:
      return { ...state, ...payload };
    case SET_EDITOR_LINE_WRAP:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default editor_reducer;
