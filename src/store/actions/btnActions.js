// src/store/actions/btnActions.js
export const SET_SHOW_CANVA = 'SET_SHOW_CANVA';
export const SET_CANVA_BG = 'SET_CANVA_BG';

export const setShowCanva = (showCanva) => ({
  type: SET_SHOW_CANVA,
  payload: showCanva,
});

export const setCanvaBg = (canvaBg) => ({
  type: SET_CANVA_BG,
  payload: canvaBg,
});
