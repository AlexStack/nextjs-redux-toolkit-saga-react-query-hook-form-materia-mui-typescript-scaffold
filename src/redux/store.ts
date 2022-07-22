import {
  Action, configureStore, ThunkAction, Store,
} from '@reduxjs/toolkit';
import createSagaMiddleware, { Task } from 'redux-saga';
import { createWrapper } from 'next-redux-wrapper';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { mainConfig } from '../configs/main-config';
import rootSaga from './saga';
import rootReducer from './features/reducer';

export interface SagaStore extends Store {
  sagaTask: Task;
  reduxPersistData: Persistor | null;
}

let newRootReducer = rootReducer;

export const enableReduxPersist = mainConfig.reduxPersistConfigs.enabled && mainConfig.isClientSide;

if (enableReduxPersist) {
  newRootReducer = persistReducer({
    ...mainConfig.reduxPersistConfigs,
    storage,
  }, rootReducer);
}

const createReduxStore = ():SagaStore => {
  const sagaMiddleware = createSagaMiddleware();
  const store          = configureStore({
    reducer   : newRootReducer,
    middleware: [sagaMiddleware],
    devTools  : mainConfig.isDevEnv,
  });

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  (store as SagaStore).reduxPersistData = enableReduxPersist
    ? persistStore(store)
    : null;

  return store as SagaStore;
};

export type ReduxStore = ReturnType<typeof createReduxStore>;
export type ReduxState = ReturnType<ReduxStore['getState']>;
export type ReduxThunk<ReturnType = void> = ThunkAction<ReturnType, ReduxState, unknown, Action>;

export const reduxWrapper = createWrapper<ReduxStore>(createReduxStore, {
  debug: mainConfig.isDevEnv,
});
