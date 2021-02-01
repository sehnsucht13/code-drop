import {
  SET_DROP_DESC,
  SET_DROP_LANG,
  SET_DROP_TITLE,
  SET_DROP_VISIBLITY,
} from "../constants/constants";

export const set_drop_visibility = (payload) => ({
  type: SET_DROP_VISIBLITY,
  payload: { visibility: payload },
});

export const set_drop_title = (payload) => ({
  type: SET_DROP_TITLE,
  payload: { title: payload },
});

export const set_drop_description = (payload) => ({
  type: SET_DROP_DESC,
  payload: { description: payload },
});

export const set_drop_language = (payload) => ({
  type: SET_DROP_LANG,
  payload: { language: payload },
});
