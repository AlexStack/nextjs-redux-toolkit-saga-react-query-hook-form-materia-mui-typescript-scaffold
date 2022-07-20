import type { GetStaticProps, NextPage } from 'next';
import React, { useEffect } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { END } from 'redux-saga';
import { reactQueryFn } from '../apis/article-api';
import ArticleImageList from '../components/ArticleImageList';
import MainLayout from '../layouts/MainLayout';

import articleSlice from '../redux/features/articleSlice';
import { ReduxState, reduxWrapper } from '../redux/store';

const Articles: NextPage = (props) => {
  // example of React Query usage
  // const { status, error, data:dataItems} = useQuery(
  //   ['articles', { page: 1 }],
  //   reactQueryFn.getArticles
  //   );

  // example of Redux usage
  const reduxDispatch = useDispatch();
  const reduxArticle  = useSelector((reduxState: ReduxState) => reduxState.article);
  const dataItems     = reduxArticle.lists;

  console.log('🚀 ~ file: articles.tsx ~ line 10 ~ props', props, reduxArticle);

  useEffect(
    () => {
      reduxDispatch(articleSlice.actions.getArticlesRequest({ tag: 'saga', page: 1 }));
    },
    [reduxDispatch],
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
export const getStaticProps4reactQuery: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    ['articles', { page: 1, tag: 'react-query' }],
    reactQueryFn.getArticles,
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },

  };
};

/**
 * Code example: use Redux Saga for server side data fetching
 */
export const getStaticProps: GetStaticProps = reduxWrapper.getStaticProps(
  (store) => async () => {
    await store.dispatch(articleSlice.actions.getArticlesRequest({ tag: 'remix', page: 1 }));
    store.dispatch(END);
    // await store.sagaTask?.toPromise();

    console.log(
      '🚀 ~ file: articles.tsx ~ line 39 ~ constgetStaticProps:GetStaticProps=reduxWrapper.getStaticProps ~ store',
      store.getState(),
    );

    return {
      props: {

      },

    };
  },
);

export default Articles;
