import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleFilterParams, ArticleSliceType } from '../../types/article-types';

const initialState: ArticleSliceType = {
  lists : [],
  status: '',
  detail: null,
};

const articleSlice = createSlice({
  name    : 'article',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getArticlesRequest: (state, action: PayloadAction<ArticleFilterParams>) => {
      console.log('🚀 ~ file: articleSlice.ts ~ line 16 ~ action', action);
      state.status = 'loading';
    },
    getArticlesSuccess: (state, action: PayloadAction<{
      data:Article[], params:ArticleFilterParams
    }>) => {
      const { data, params } = action.payload;
      console.log('🚀 ~ file: articleSlice.ts ~ line 23 ~ params', params);

      state.lists = params.page && params.page > 1 ? [...state.lists, ...data] : data;

      state.status = 'loaded';
    },
    getArticlesFailure: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line no-multi-spaces
      state.status  = 'error';
      state.message = action.payload;
    },
    getArticleDetailRequest: (state, action: PayloadAction<{ id:number }>) => {
      state.detail = state.lists.find((article) => article.id === action.payload.id) || null;
      state.status = 'loading';
    },
    getArticleDetailSuccess: (state, action: PayloadAction<Article>) => {
      state.detail = action.payload;
      state.status = 'loaded';
    },
  },
});

export default articleSlice;
