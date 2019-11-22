import { fork } from 'redux-saga/effects';
import watchFeed from './watchers';

export default function* startForman() {
  yield fork(watchFeed);
}