import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from '@reduxjs/toolkit';
import type { AnyAction, CombinedState } from '@reduxjs/toolkit';

import userSlice from './userSlice';
import articleSlice from './articleSlice';

interface ReducerState {
  [userSlice.name] : ReturnType<typeof userSlice.reducer>;
  [articleSlice.name]: ReturnType<typeof articleSlice.reducer>;
}

const sliceReducer =  {
  [userSlice.name]   : userSlice.reducer,
  [articleSlice.name]: articleSlice.reducer,
};

const rootReducer = (state: any, action: AnyAction): CombinedState<ReducerState> => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return combineReducers(sliceReducer)(state, action);
};

export default rootReducer;
