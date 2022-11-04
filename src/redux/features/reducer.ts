import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from '@reduxjs/toolkit';
import type { AnyAction, CombinedState } from '@reduxjs/toolkit';
import { mainConfig } from '../../configs/main-config';

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
  // Doc: https://github.com/kirill-konshin/next-redux-wrapper#state-reconciliation-during-hydration
  if (action.type === HYDRATE) {
    // consoleLog('🚀 ~ file: reducer.ts ~ line 20 ~ from hydration', action, mainConfig.isClientSide, state);

    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };

    nextState.user = state.user; // preserve user data on client side navigation

    // if (mainConfig.isClientSide) {
    //   nextState.article = state.article;
    // }

    return nextState;
  }

  return combineReducers(sliceReducer)(state, action);
};

export default rootReducer;
