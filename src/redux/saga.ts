import { call, takeLatest, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import articleSlice from './features/articleSlice';
import * as articleApi from '../apis/article-api';
import * as userApi from '../apis/user-api';

import {
  Article, ArticleFilterParams, AvatarResponse, UploadFileParams,
} from '../types/article-types';
import userSlice from './features/userSlice';
import { consoleLog } from '../utils/console-log';

export function* fetchArticles(action: PayloadAction<ArticleFilterParams>) {
  try {
    const response:Article[] = yield call(articleApi.getArticles, action.payload);

    const newData = {
      params: action.payload,
      data  : response,
    };

    // const response:Article[] = yield call(() => articleApi.getArticles(action.payload));

    yield put(articleSlice.actions.getArticlesSuccess(newData));
  } catch (e: any) {
    consoleLog('🚀 ~ file: saga.ts ~ line 19 ~ function*fetchArticles ~ e', e);

    yield put(articleSlice.actions.getArticlesFailure(e.message));
  }
}

export function* fetchArticleDetail(action: PayloadAction<{ id: number }>) {
  try {
    const response:Article = yield call(() => articleApi.getArticleDetail(action.payload));

    yield put(articleSlice.actions.getArticleDetailSuccess(response));
  } catch (e: any) {
    // yield put(articleSlice.actions.getArticleDetailFailure(e.message));
  }
}

export function* uploadAvatar(action: PayloadAction<UploadFileParams>) {
  try {
    const response:AvatarResponse = yield call(userApi.uploadAvatar, action.payload);

    consoleLog('🚀 ~ file: saga.ts ~ line 40 ~ function*uploadAvatar ~ response', response);

    yield put(userSlice.actions.uploadAvatarSuccess(response));
  } catch (e: any) {
    consoleLog('🚀 ~ file: saga.ts ~ line 40 ~ function*uploadAvatar ~ error', e);

    // yield put(articleSlice.actions.getArticleDetailFailure(e.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(articleSlice.actions.getArticlesRequest, fetchArticles);
  yield takeLatest(articleSlice.actions.getArticleDetailRequest, fetchArticleDetail);

  // uploadAvatarRequest
  yield takeLatest(userSlice.actions.uploadAvatarRequest, uploadAvatar);

  // yield takeLatest(userSlice.actions.visit, fetchNumberSaga)
}
