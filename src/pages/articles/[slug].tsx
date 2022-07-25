import type {
  GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage,
} from 'next';
import React from 'react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { END } from 'redux-saga';
import { useDispatch } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { reactQueryFn } from '../../apis/article-api';
import MainLayout from '../../layouts/MainLayout';
import articleSlice from '../../redux/features/articleSlice';
import { ReduxState, reduxWrapper } from '../../redux/store';
import getRouterParam from '../../utils/get-router-param';
import { mainConfig } from '../../configs/main-config';
import getIdFromSlug from '../../utils/get-id-from-slug';
import ArticleDetail from '../../components/ArticleDetail';
import userSlice from '../../redux/features/userSlice';

const ArticleDetails: NextPage = ({
  serverRedux,
  articleId,
}
:InferGetStaticPropsType<typeof getStaticProps>) => {
  const reduxDispatch = useDispatch();

  const { data:reactQueryData } = useQuery(
    ['articles', { id: articleId }],
    reactQueryFn.getArticleDetail,
    { enabled: !mainConfig.isReduxForStaticPropsEnabled && articleId > 0 },
  );

  const articleDetail = mainConfig.isReduxForStaticPropsEnabled
    ? serverRedux?.article.detail
    : reactQueryData;

  useEffectOnce(
    () => {
      if (mainConfig.isStaticPageDebugDisabled
         && mainConfig.isClientSide && articleDetail?.id > 0) {
        reduxDispatch(userSlice.actions.recentItemRequest(articleDetail));
      }
    },
  );

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

export const getStaticProps = mainConfig.isReduxForStaticPropsEnabled
  ? getStaticPropsFromRedux
  : getStaticPropsFromReactQuery;

export default ArticleDetails;
