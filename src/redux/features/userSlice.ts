import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mainConfig } from '../../configs/main-config';
import { Article, FavoriteItem } from '../../types/article-types';

interface UserSliceType {
  identityToken: string;
  visitedTimes: number;
  recentItems: FavoriteItem[];
  favoriteItems: FavoriteItem[];
}

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
        state.identityToken = `identity-token-${new Date()}`;
      }
      state.visitedTimes += 1;
    },
    recentItemRequest: (state, action: PayloadAction<Article>) => {
      if (state.recentItems[0]?.id === action.payload.id) {
        return;
      }
      const restItems = state.recentItems.filter((item) => item.id !== action.payload.id);
      const newItem   = {
        id           : action.payload.id,
        title        : action.payload.title,
        description  : action.payload.description,
        tags         : action.payload.tags,
        cover_image  : action.payload.cover_image,
        slug         : action.payload.slug,
        published_at : action.payload.published_at,
        visited_at   : new Date().toISOString(),
        author       : action.payload.user.name,
        author_avatar: action.payload.user.profile_image_90,
      };
      // new visited item will be added to the front of the array
      // keep maximum xxx items in the array
      state.recentItems = [newItem, ...restItems.slice(0, mainConfig.maxRecentItems - 1)];
      console.log('🚀 ~ file: userSlice.ts ~ line 46 ~ newItem', newItem);
    },
  },
});

export default userSlice;
