import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mainConfig } from '../../configs/main-config';
import { convertArticleToFavoriteItem } from '../../helpers/article-helper';
import {
  Article, AvatarResponse, FavoriteItem, Profile, UploadFileParams, UserSliceType,
} from '../../types/article-types';

export const defaultProfileValues: Profile = {
  firstName : '',
  isFemale  : false,
  ageRange  : 30,
  starRating: 2.5,
  avatarUrl : '',

  uploadProvider    : 'imagekit',
  favoriteMaterialUI: true,
  favoriteChakraUI  : false,
  favoriteSemanticUI: false,
  favoriteAntDesign : true,
  yearsUsingReact   : 1.5,

};

const initialState: UserSliceType = {
  identityToken: '',
  visitedTimes : 1,
  recentItems  : [],
  favoriteItems: [],
  profile      : defaultProfileValues,
  status       : '',
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

    uploadAvatarRequest: (state, action: PayloadAction<UploadFileParams>) => {
      state.status = 'loading';
      console.log('🚀 ~ file: userSlice.ts ~ line 57 ~ uploadAvatarRequest', action, state);
    },
    uploadAvatarSuccess: (state, action: PayloadAction<AvatarResponse>) => {
      console.log('🚀 ~ file: userSlice.ts ~ line 57 ~ uploadAvatarSuccess', action, state);
      state.status = 'loaded';

      state.profile = { ...state.profile, avatarUrl: action.payload.avatarUrl };
    },

    updateProfileRequest: (state, action: PayloadAction<Profile>) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
        avatarUrl: state.profile.avatarUrl, // avatarUrl is update separately
      };
      console.log('🚀 ~ file: userSlice.ts ~ line 57 ~ updateProfileRequest', action, state);
    },
  },
});

export default userSlice;
