import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mainConfig } from '../../configs/main-config';
import { convertArticleToFavoriteItem } from '../../helpers/article-helper';
import { Article, FavoriteItem, UserSliceType } from '../../types/article-types';

const initialState: UserSliceType = {
  identityToken: '',
  visitedTimes : 1,
  recentItems  : [],
  favoriteItems: [],
};

const userSlice = createSlice({
  name    : 'user',
  initialState,
  reducers: {
    visitRequest: (state) => {
      if (state.identityToken === '') {
        const isoDate = new Date().toISOString();
        const token   = mainConfig.isClientSide ? navigator.userAgent : Math.random().toString();

        state.identityToken = `${token}|ISO DATE:${isoDate}`;
      }
      state.visitedTimes += 1;
    },

    recentItemRequest: (state, action: PayloadAction<Article>) => {
      if (state.recentItems[0]?.id === action.payload.id) {
        return;
      }
      const restItems   = state.recentItems.filter((item) => item.id !== action.payload.id);
      const newItem     = convertArticleToFavoriteItem(action.payload);
      state.recentItems = [newItem, ...restItems.slice(0, mainConfig.maxRecentItems - 1)];
    },

    favoriteItemRequest: (state, action: PayloadAction<Article | FavoriteItem>) => {
      if (state.favoriteItems.find((item) => item.id === action.payload.id)) {
        state.favoriteItems = state.favoriteItems.filter((item) => item.id !== action.payload.id);
        return;
      }
      const payload =  'visited_at' in action.payload
        ? action.payload : convertArticleToFavoriteItem(action.payload);
      const newItem = {
        ...payload,
        favorite_at: new Date().toISOString(),
      };
      state.favoriteItems.unshift(newItem);
    },
  },
});

export default userSlice;
