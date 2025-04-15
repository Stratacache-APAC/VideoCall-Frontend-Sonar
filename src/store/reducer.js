import { combineReducers } from 'redux';
import dashboardReducer from './reducers/dashboardReducer';
import callReducer from './reducers/callReducer';
import btnReducer from './reducers/btnReducer';

export default combineReducers({
  dashboard: dashboardReducer,
  call: callReducer,
  btn: btnReducer,
});
