import { IS_DEV } from '../constants/article-const';

const isClientSide = typeof window !== 'undefined';

export const mainConfig = {
  // set to false will not fetch the dynamic data from the client side
  // then we can see what's the NextJs static pages looks like - for SEO
  isStaticPageDebugDisabled: true,

  // set to false will use React Query for getStaticProps instead of use Redux
  // client side still check ReduxState first, then use React Query
  isReduxForStaticPropsEnabled: true,

  // Redux PersistConfig props
  // set enabled to false can disable persist (requires remove PersistGate in _app.tx)
  reduxPersistConfigs: {
    key: 'AlexAppData', version: 0.4, debug: IS_DEV, enabled: true,
  },

  // max number of recent visited articles to save in local storage
  maxRecentItems: 40,

  // article list page re-generate every xxx seconds
  listPageRefreshInterval: IS_DEV ? 600 : 3600 * 24 * 2,

  // article detail page re-generate every xxx seconds
  detailPageRefreshInterval: IS_DEV ? 600 : 3600 * 24 * 30,

  // is dev env, we can force it to true to debug -> isDevEnv:true
  isDevEnv: IS_DEV,

  // is client side, we can force it to true to debug -> isClientSide:true
  isClientSide,
};

export default mainConfig;
