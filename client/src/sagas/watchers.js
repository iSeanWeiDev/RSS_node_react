import { takeLatest } from 'redux-saga/effects';
import searchFeed from './feedSagas';
import * as types from '../constants/actionTypes';

export default function* watchFeed() {
  yield takeLatest(types.FETCH_FEED, searchFeed);
}
