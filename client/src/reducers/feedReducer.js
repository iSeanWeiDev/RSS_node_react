import * as types from '../constants/actionTypes';

export default function (state = { urlList: [], pending: false }, action) {
  switch (action.type) {
    case types.FETCH_FEED_SUCCESS:
      return { ...state, urlList: action.urlList, pending: false };
    case types.FETCH_FEED:
      return { ...state, urlList: action.urlList, pending: true };
    case types.FETCH_FEED_FAILURE:
      return { ...state, urlList: action.urlList, pending: false };
    default:
      return state;
  }
}