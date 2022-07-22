export const mainConfig = {
  // set to true will not fetch the dynamic data from the client side
  // then we can see what's the NextJs static pages looks like - for SEO
  enableStaticPageDebug: true,

  // set to false will use React Query for getStaticProps instead of use Redux
  // client side still check ReduxState first, then use React Query
  enableReduxForStaticProps: true,

  // set reduxPersistKey to empty will disable redux persist
  reduxPersistKey: 'AlexAppData',

  // is dev env
  isDevEnv: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',

  // is client side
  isClientSide: typeof window !== 'undefined',
};

export default mainConfig;
