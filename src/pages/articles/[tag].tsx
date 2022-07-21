import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React, { useEffect } from 'react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import { reactQueryFn } from '../../apis/article-api';
import ArticleImageList from '../../components/ArticleImageList';
import MainLayout from '../../layouts/MainLayout';
import articleSlice from '../../redux/features/articleSlice';
import { ReduxState, reduxWrapper } from '../../redux/store';
import getRouterParam from '../../utils/get-router-param';
import { DEFAULT_KEYWORD, TOP_MENU_PAGES } from '../../constants/article-const';
import { mainConfig } from '../../configs/main-config';

const Articles: NextPage = (props) => {
  const router = useRouter();
  const tag    = getRouterParam(router.query.tag, DEFAULT_KEYWORD).toLowerCase();
  const page   = parseInt(getRouterParam(router.query.page, '1'), 10);

  // example of Redux usage
  const reduxDispatch = useDispatch();
  const reduxArticle  = useSelector((reduxState: ReduxState) => reduxState.article);

  // example of React Query usage
  const { data:rqDataItems } = useQuery(
    ['articles', { tag, page }],
    reactQueryFn.getArticles,
    { enabled: !mainConfig.enableReduxForStaticProps },
  );

  const dataItems = mainConfig.enableReduxForStaticProps ? reduxArticle.lists : rqDataItems;

  console.log(
    '🚀 ~ file: articles.tsx ~ line 10 ~ props',
    props,
    reduxArticle.lists?.length,
    rqDataItems?.length,
  );

  useEffect(
    () => {
      if (!mainConfig.enableStaticPageDebug) {
        reduxDispatch(articleSlice.actions.getArticlesRequest({ tag, page }));
      }
    },
    [page, reduxDispatch, tag],
  );

  return (
    <MainLayout>
      <ArticleImageList dataItems={dataItems} />
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TOP_MENU_PAGES.map((item: string) => ({
    params: {
      tag: item,
    },
  }));

  return { paths, fallback: true };
};

/**
 * Code example: use React Query for server side data fetching
 */
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
    // Next.js will attempt to re-generate the page:
    // - When a request comes in at most once every XXX seconds
    revalidate: 36000, // 10 hours
  };
};

/**
 * Code example: use Redux Saga for server side data fetching
 */
export const getStaticPropsFromRedux: GetStaticProps = reduxWrapper.getStaticProps(
  (store) => async ({ params }) => {
    const tag = getRouterParam(params?.tag, DEFAULT_KEYWORD).toLowerCase();

    store.dispatch(articleSlice.actions.getArticlesRequest({ tag, page: 1 }));
    store.dispatch(END);
    await store.sagaTask.toPromise();

    console.log(
      '🚀 ~ file: articles.tsx ~ line 39 ~ :store.getState',
      // params,
      store.getState(),
      // rs,
    );

    return {
      props: {
        tag,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in at most once every XXX seconds
      revalidate: 36000, // 10 hours
    };
  },
);

export const getStaticProps = mainConfig.enableReduxForStaticProps
  ? getStaticPropsFromRedux
  : getStaticPropsFromReactQuery;

export default Articles;
