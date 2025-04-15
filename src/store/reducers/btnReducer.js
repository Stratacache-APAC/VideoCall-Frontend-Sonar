// src/store/reducers/btnReducer.js
import { SET_SHOW_CANVA, SET_CANVA_BG } from '../actions/btnActions';
// import bg3 from '../../../../../../../resources/AUM_3747.jpg';

const initialState = {
  showCanva: true,
  canvaBg: null,
};

const btnReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SHOW_CANVA:
      return {
        ...state,
        showCanva: action.payload,
      };
    case SET_CANVA_BG:
      return {
        ...state,
        canvaBg: action.payload, // Update canvaBg state
     };
    default:
      return state;
  }
};

export default btnReducer;
