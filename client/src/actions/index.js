import * as types from '../constants/actionTypes';

export const fetchFeedAction = (urlList) => ({
  type: types.FETCH_FEED,
  urlList,
});