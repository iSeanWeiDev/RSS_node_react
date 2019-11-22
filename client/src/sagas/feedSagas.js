import { put, call } from 'redux-saga/effects';

import { feedSearch } from '../api';
import * as types from '../constants/actionTypes';

export default function* searchFeed({ urlList }) {
  try {
    yield put({ type: types.FETCH_FEED_REQUEST, pending: true })
    const feed = yield call(feedSearch, urlList)

    yield put({ type: types.FETCH_FEED_SUCCESS, urlList: feed, pending: false });
  } catch (error) {
    yield put({ type: 'FETCH_FEED_FAILURE', error, pending: false });
  }
}
