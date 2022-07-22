import type {
  GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage,
} from 'next';
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
import userSlice from '../../redux/features/userSlice';
import getIdFromSlug from '../../utils/get-id-from-slug';

const ArticleDetails: NextPage = ({ serverRedux }
:InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log('🚀 ~ file: [slug].tsx ~ line 19 ~ serverRedux', serverRedux);
  const router      = useRouter();
  const articleSlug = getRouterParam(router.query.slug);
  const articleId   = getIdFromSlug(articleSlug);

  const articleDetail = serverRedux?.article.detail;

  // // Redux usage
  // const reduxDispatch = useDispatch();
  // const reduxArticle = useSelector((reduxState: ReduxState) => reduxState.article);

  // // React Query usage
  // const { data:rqDataItems } = useQuery(
  //   ['articles', { tag, page }],
  //   reactQueryFn.getArticles,
  //   { enabled: !mainConfig.enableReduxForStaticProps },
  // );

  // const dataItems = mainConfig.enableReduxForStaticProps ? reduxArticle.lists : rqDataItems;

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
      sss
      {articleDetail?.id}
      {' '}
      --
      {' '}
      {articleDetail?.description}
      {' '}
      {articleDetail?.title}
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
    revalidate: 36000, // re-generate the static page every XXX seconds
  };
};

export const getStaticPropsFromRedux: GetStaticProps = reduxWrapper.getStaticProps(
  (store) => async ({ params }) => {
    const articleSlug = getRouterParam(params?.slug);
    const articleId   = getIdFromSlug(articleSlug) || 0;

    store.dispatch(articleSlice.actions.getArticleDetailRequest({ id: articleId }));
    store.dispatch(END);
    await store.sagaTask.toPromise();

    return {
      props: {
        articleId,
        slug       : articleSlug,
        serverRedux: store.getState() as ReduxState,
      },
      revalidate: 36000,
      notFound  : !articleId,
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
