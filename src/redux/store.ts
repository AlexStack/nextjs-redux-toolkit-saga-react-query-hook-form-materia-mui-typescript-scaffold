import { Action, configureStore, ThunkAction, Store } from "@reduxjs/toolkit";
import createSagaMiddleware, {Task} from 'redux-saga';
import {createWrapper, Context, HYDRATE} from 'next-redux-wrapper';
import rootSaga from "./saga";
import userSlice from "./features/userSlice";
import articleSlice from "./features/articleSlice";

const rootReducer =  {
  [userSlice.name]: userSlice.reducer,
  [articleSlice.name]: articleSlice.reducer,
};

// const sagaMiddleware = createSagaMiddleware();

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: [sagaMiddleware],
//   devTools: process.env.NEXT_PUBLIC_NODE_ENV === "development",
// });

// sagaMiddleware.run(rootSaga);

export interface SagaStore extends Store {
  sagaTask?: Task;
}

const createReduxStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const store = configureStore({
    reducer: rootReducer,
    middleware: middlewares,
    devTools: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  });
  
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};


// const store = createReduxStore();

// store.dispatch(userSlice.actions.visit('1'));

export type ReduxStore = ReturnType<typeof createReduxStore>;
export type ReduxState = ReturnType<ReduxStore['getState']>;
export type ReduxThunk<ReturnType = void> = ThunkAction<ReturnType, ReduxState, unknown, Action>;

export const reduxWrapper = createWrapper<ReduxStore>(createReduxStore, {
  debug: process.env.NEXT_PUBLIC_NODE_ENV === "development",
});
