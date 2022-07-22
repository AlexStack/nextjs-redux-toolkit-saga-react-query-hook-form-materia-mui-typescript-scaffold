import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React, { useEffect } from 'react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import { reactQueryFn } from '../../../apis/article-api';
import ArticleImageList from '../../../components/ArticleImageList';
import MainLayout from '../../../layouts/MainLayout';
import articleSlice from '../../../redux/features/articleSlice';
import { ReduxState, reduxWrapper } from '../../../redux/store';
import getRouterParam from '../../../utils/get-router-param';
import { DEFAULT_KEYWORD, TOP_MENU_PAGES } from '../../../constants/article-const';
import { mainConfig } from '../../../configs/main-config';
import userSlice from '../../../redux/features/userSlice';

const Articles: NextPage = () => {
  const router = useRouter();
  const tag    = getRouterParam(router.query.tag, DEFAULT_KEYWORD).toLowerCase();
  const page   = parseInt(getRouterParam(router.query.page, '1'), 10);

  // Redux usage
  const reduxDispatch = useDispatch();
  const reduxArticle  = useSelector((reduxState: ReduxState) => reduxState.article);

  // React Query usage
  const { data:rqDataItems } = useQuery(
    ['articles', { tag, page }],
    reactQueryFn.getArticles,
    { enabled: !mainConfig.enableReduxForStaticProps },
  );

  const dataItems = mainConfig.enableReduxForStaticProps ? reduxArticle.lists : rqDataItems;

  useEffect(
    () => {
      if (!mainConfig.enableStaticPageDebug) {
        reduxDispatch(articleSlice.actions.getArticlesRequest({ tag, page }));
      }
      reduxDispatch(userSlice.actions.visitRequest());
    },
    [page, reduxDispatch, tag],
  );

  return (
    <MainLayout>
      <ArticleImageList dataItems={dataItems} />
    </MainLayout>
  );
};

export const getStaticPropsFromReactQuery: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();

  const tag = getRouterParam(params?.tag, DEFAULT_KEYWORD).toLowerCase();

  await queryClient.prefetchQuery(
    ['articles', { page: 1, tag }],
    reactQueryFn.getArticles,
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: mainConfig.listPageRefreshInterval,
  };
};

export const getStaticPropsFromRedux: GetStaticProps = reduxWrapper.getStaticProps(
  (store) => async ({ params }) => {
    const tag = getRouterParam(params?.tag, DEFAULT_KEYWORD).toLowerCase();

    store.dispatch(articleSlice.actions.getArticlesRequest({ tag, page: 1 }));
    store.dispatch(END);
    await store.sagaTask.toPromise();

    return {
      props: {
        tag,
      },
      revalidate: mainConfig.listPageRefreshInterval,
    };
  },
);

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TOP_MENU_PAGES.map((item: string) => ({
    params: {
      tag: item,
    },
  }));
  return { paths, fallback: true };
};

export const getStaticProps = mainConfig.enableReduxForStaticProps
  ? getStaticPropsFromRedux
  : getStaticPropsFromReactQuery;

export default Articles;
