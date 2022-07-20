import type { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { getArticles } from '../apis/article-api';
import ArticleImageList from '../components/ArticleImageList';
import MainLayout from '../layouts/MainLayout';

const Articles: NextPage = (props) => {
  const { status, error, data:dataItems} = useQuery(['articles', { page: 1 }], getArticles);

  // console.log('🚀 ~ file: articles.tsx ~ line 10 ~ props', props, dataItems,status, error);

  return (
    <MainLayout>
        <ArticleImageList dataItems={dataItems} />
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['articles', { page: 1 }], getArticles);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Articles;
