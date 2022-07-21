export const mainConfig = {
  // set to true will not fetch the dynamic data from the client side
  // then we can see what's the NextJs static pages looks like - for SEO
  enableStaticPageDebug: false,

  // set to false will use React Query for getStaticProps instead of use Redux
  // client side still check ReduxState first, then use React Query
  enableReduxForStaticProps: false,
};

export default mainConfig;
