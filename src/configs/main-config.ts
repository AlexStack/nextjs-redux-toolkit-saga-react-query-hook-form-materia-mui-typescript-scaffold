const isDevEnv     = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';
const isClientSide = typeof window !== 'undefined';

export const mainConfig = {
  // set to true will not fetch the dynamic data from the client side
  // then we can see what's the NextJs static pages looks like - for SEO
  enableStaticPageDebug: true,

  // set to false will use React Query for getStaticProps instead of use Redux
  // client side still check ReduxState first, then use React Query
  enableReduxForStaticProps: true,

  // Redux PersistConfig props
  // set enabled to false can disable persist (requires remove PersistGate in _app.tx)
  reduxPersistConfigs: {
    key: 'AlexAppData', version: 1, debug: isDevEnv, enabled: true,
  },

  // is dev env, we can force it to true to debug -> isDevEnv:true
  isDevEnv,

  // is client side, we can force it to true to debug -> isClientSide:true
  isClientSide,
};

export default mainConfig;
