const isDevEnv     = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';
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
    key: 'AlexAppData', version: 0.2, debug: isDevEnv, enabled: true,
  },

  // max number of recent visited articles to save in local storage
  maxRecentItems: 40,

  // article list page re-generate every xxx seconds
  listPageRefreshInterval: 3600 * 5,

  // article detail page re-generate every xxx seconds
  detailPageRefreshInterval: 3600 * 24,

  // is dev env, we can force it to true to debug -> isDevEnv:true
  isDevEnv,

  // is client side, we can force it to true to debug -> isClientSide:true
  isClientSide,
};

export default mainConfig;
