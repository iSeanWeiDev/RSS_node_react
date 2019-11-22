import { combineReducers } from 'redux';
import feed from './feedReducer';

const rootReducer = combineReducers({
  feed
});

export default rootReducer;