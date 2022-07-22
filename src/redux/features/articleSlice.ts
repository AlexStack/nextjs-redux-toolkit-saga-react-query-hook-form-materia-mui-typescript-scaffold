import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleSliceType } from '../../types/article-types';

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
    getArticlesRequest: (state, action: PayloadAction<{ page:number, tag:string }>) => {
      state.status = 'loading';
    },
    getArticlesSuccess: (state, action: PayloadAction<Article[]>) => {
      // eslint-disable-next-line no-multi-spaces
      state.lists  = action.payload;
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
