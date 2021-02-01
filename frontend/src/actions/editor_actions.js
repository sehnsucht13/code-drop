import {
  SET_EDITOR_THEME,
  SET_EDITOR_LANG,
  SET_EDITOR_FONT_SIZE,
  SET_EDITOR_KEYMAP,
  SET_EDITOR_TAB_SIZE,
  SET_EDITOR_LINE_WRAP,
  SET_EDITOR_INSTANCE,
} from "../constants/constants";

export const set_editor_language = (lang) => ({
  type: SET_EDITOR_LANG,
  payload: { language: lang },
});

export const set_editor_font_size = (size) => ({
  type: SET_EDITOR_FONT_SIZE,
  payload: { font_size: size },
});

export const set_editor_keymap = (keymap_name) => ({
  type: SET_EDITOR_KEYMAP,
  payload: { keymap: keymap_name },
});
export const set_editor_tab_size = (size) => ({
  type: SET_EDITOR_TAB_SIZE,
  payload: { tab_size: size },
});
export const set_editor_theme = (theme_name) => ({
  type: SET_EDITOR_THEME,
  payload: { theme: theme_name },
});
export const set_editor_line_wrap = (wrap) => ({
  type: SET_EDITOR_LINE_WRAP,
  payload: { line_wrap: wrap },
});
export const set_editor_instance = (instance) => ({
  type: SET_EDITOR_INSTANCE,
  payload: { instance: instance },
});
