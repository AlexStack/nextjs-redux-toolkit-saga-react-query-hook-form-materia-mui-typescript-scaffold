import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React, { useEffect } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
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

const Articles: NextPage = (props) => {
  // example of React Query usage
  // const { status, error, data:dataItems} = useQuery(
  //   ['articles', { page: 1 }],
  //   reactQueryFn.getArticles
  //   );

  const router = useRouter();

  // example of Redux usage
  const reduxDispatch = useDispatch();
  const reduxArticle  = useSelector((reduxState: ReduxState) => reduxState.article);
  const dataItems     = reduxArticle.lists;
  const tag           = getRouterParam(router.query.tag, DEFAULT_KEYWORD);
  const page          = getRouterParam(router.query.page, '1');

  console.log('🚀 ~ file: articles.tsx ~ line 10 ~ props', props, router, reduxArticle);

  useEffect(
    () => {
      reduxDispatch(articleSlice.actions.getArticlesRequest({
        tag : tag.toLowerCase(),
        page: parseInt(page, 10),
      }));
    },
    [page, reduxDispatch, tag],
  );

  return (
    <MainLayout>
      <ArticleImageList dataItems={dataItems} />
    </MainLayout>
  );
};

/**
 * Code example: use React Query for server side data fetching
 */
export const getStaticProps4reactQuery: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    ['articles', { page: 1, tag: getRouterParam(params?.tag, DEFAULT_KEYWORD) }],
    reactQueryFn.getArticles,
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },

  };
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
 * Code example: use Redux Saga for server side data fetching
 */
export const getStaticProps: GetStaticProps = reduxWrapper.getStaticProps(
  (store) => async ({ params }) => {
    await store.dispatch(articleSlice.actions.getArticlesRequest({
      tag : getRouterParam(params?.tag, DEFAULT_KEYWORD),
      page: 1,
    }));
    store.dispatch(END);
    // await store.sagaTask?.toPromise();

    // console.log(
    //   '🚀 ~ file: articles.tsx ~ line 39 ~ :GetStaticProps=reduxWrapper.getStaticProps ~ store',
    //   params,
    //   store.getState(),
    // );

    return {
      props: {},

    };
  },
);

export default Articles;
