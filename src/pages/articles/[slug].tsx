import type {
  GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage,
} from 'next';
import React from 'react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { END } from 'redux-saga';
import { reactQueryFn } from '../../apis/article-api';
import MainLayout from '../../layouts/MainLayout';
import articleSlice from '../../redux/features/articleSlice';
import { ReduxState, reduxWrapper } from '../../redux/store';
import getRouterParam from '../../utils/get-router-param';
import { mainConfig } from '../../configs/main-config';
import getIdFromSlug from '../../utils/get-id-from-slug';
import ArticleDetail from '../../components/ArticleDetail';

const ArticleDetails: NextPage = ({
  serverRedux,
  articleId,
}
:InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log('🚀 ~ file: [slug].tsx ~ line 19 ~ serverRedux', serverRedux, mainConfig);
  // const router      = useRouter();
  // const articleSlug = getRouterParam(router.query.slug);
  // const articleId   = getIdFromSlug(articleSlug) || 0;

  // const articleDetail = serverRedux?.article.detail;

  // // Redux usage
  // const reduxDispatch = useDispatch();
  // const reduxArticle = useSelector((reduxState: ReduxState) => reduxState.article);

  // // React Query usage
  const { data:reactQueryData } = useQuery(
    ['articles', { id: articleId }],
    reactQueryFn.getArticleDetail,
    { enabled: !mainConfig.enableReduxForStaticProps && articleId > 0 },
  );

  const articleDetail = mainConfig.enableReduxForStaticProps
    ? serverRedux?.article.detail
    : reactQueryData;

  // useEffect(
  //   () => {
  //     if (!mainConfig.enableStaticPageDebug) {
  //       reduxDispatch(articleSlice.actions.getArticleDetailRequest({ tag, page }));
  //     }
  //     reduxDispatch(userSlice.actions.visitRequest());
  //   },
  //   [page, reduxDispatch, tag],
  // );

  return (
    <MainLayout>
      {articleDetail && <ArticleDetail article={articleDetail} />}
    </MainLayout>
  );
};

export const getStaticPropsFromReactQuery: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();

  const articleId = getIdFromSlug(getRouterParam(params?.slug)) || 0;

  await queryClient.prefetchQuery(
    ['articles', { id: articleId }],
    reactQueryFn.getArticleDetail,
  );

  return {
    props: {
      articleId,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: mainConfig.detailPageRefreshInterval,
  };
};

export const getStaticPropsFromRedux: GetStaticProps = reduxWrapper.getStaticProps(
  (store) => async ({ params }) => {
    const articleId = getIdFromSlug(getRouterParam(params?.slug)) || 0;

    store.dispatch(articleSlice.actions.getArticleDetailRequest({ id: articleId }));
    store.dispatch(END);
    await store.sagaTask.toPromise();

    return {
      props: {
        articleId,
        serverRedux: store.getState() as ReduxState,
      },
      revalidate: mainConfig.detailPageRefreshInterval,
      notFound  : articleId < 1,
    };
  },
);

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{
    params: {
      slug: 'test-1147290',
    },
  }];
  return { paths, fallback: true };
};

export const getStaticProps = mainConfig.enableReduxForStaticProps
  ? getStaticPropsFromRedux
  : getStaticPropsFromReactQuery;

export default ArticleDetails;
