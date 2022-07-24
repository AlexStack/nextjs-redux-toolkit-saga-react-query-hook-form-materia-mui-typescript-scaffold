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
import { DEFAULT_KEYWORD, TOP_MENU_TAGS, ITEMS_PER_PAGE } from '../../../constants/article-const';
import { mainConfig } from '../../../configs/main-config';
import userSlice from '../../../redux/features/userSlice';

const Articles: NextPage = () => {
  const router      = useRouter();
  const originalTag = getRouterParam(router.query.tag, DEFAULT_KEYWORD);
  const tag         = originalTag.toLowerCase();
  const pageRef     = React.useRef(1);

  // Redux usage
  const reduxDispatch = useDispatch();
  const reduxArticle  = useSelector((reduxState: ReduxState) => reduxState.article);

  // reset pageRef.current if search different tag
  if (reduxArticle.searchTag !== '' && reduxArticle.searchTag !== tag) {
    pageRef.current = 1;
  }

  // React Query usage
  const { data:rqDataItems } = useQuery(
    ['articles', { tag, page: pageRef.current }],
    reactQueryFn.getArticles,
    { enabled: !mainConfig.isReduxForStaticPropsEnabled },
  );

  const dataItems   = mainConfig.isReduxForStaticPropsEnabled ? reduxArticle.lists : rqDataItems;
  const isLoading   = reduxArticle.status === 'loading';
  const isEndOfList = !isLoading && dataItems.length > 0
                      && dataItems.length < pageRef.current * ITEMS_PER_PAGE;

  const onClickLoadMore = () => {
    reduxDispatch(articleSlice.actions.getArticlesRequest({ tag, page: pageRef.current + 1 }));
    pageRef.current += 1;
  };

  useEffect(
    () => {
      if (mainConfig.isStaticPageDebugDisabled) {
        reduxDispatch(articleSlice.actions.getArticlesRequest({ tag, page: pageRef.current }));
      }
      reduxDispatch(userSlice.actions.visitRequest());
    },
    [reduxDispatch, tag],
  );

  return (
    <MainLayout>
      <ArticleImageList
        dataItems={dataItems}
        tag={originalTag}
        onClickLoadMore={onClickLoadMore}
        loading={reduxArticle.status === 'loading'}
        isEndOfList={isEndOfList}
      />
    </MainLayout>
  );
};

export const getStaticPropsFromReactQuery: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();

  const tag  = getRouterParam(params?.tag, DEFAULT_KEYWORD).toLowerCase();
  const page = parseInt(getRouterParam(params?.page, '1'), 10);

  await queryClient.prefetchQuery(
    ['articles', { page, tag }],
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
    const tag  = getRouterParam(params?.tag, DEFAULT_KEYWORD).toLowerCase();
    const page = parseInt(getRouterParam(params?.page, '1'), 10);
    console.log('🚀 ~ file: [tag].tsx ~ line 75 ~ params', params);

    store.dispatch(articleSlice.actions.getArticlesRequest({ tag, page }));
    store.dispatch(END);
    await store.sagaTask.toPromise();

    return {
      props: {
        tag,
        page,
      },
      revalidate: mainConfig.listPageRefreshInterval,
    };
  },
);

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TOP_MENU_TAGS.map((item: string) => ({
    params: {
      tag: item,
    },
  }));
  return { paths, fallback: true };
};

export const getStaticProps = mainConfig.isReduxForStaticPropsEnabled
  ? getStaticPropsFromRedux
  : getStaticPropsFromReactQuery;

export default Articles;
