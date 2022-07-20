import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../../types/article-types';

interface ArticleSliceType {
  lists: Article[];
  status: 'loading' | 'loaded' | 'error' | '';
  message?: string;
}

const initialState: ArticleSliceType = {
  lists : [],
  status: '',
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
  },
});

export default articleSlice;
