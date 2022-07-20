import axios from 'axios';
import { BASE_API_URI } from '../constants/article-const';
import { Article, ArticleFilterParams } from '../types/article-types';

interface ReactQueryFnProps<T> {
  queryKey: [string, T];
}

export const getArticles = async ({ tag = 'react', page = 1 }:ArticleFilterParams):Promise<Article[]> => {
  const apiEndpoint = `${BASE_API_URI}/articles?tag=${tag}&page=${page}`;
  const response    = await axios.get(apiEndpoint);
  return response.data;
};

export const reactQueryFn = {
  getArticles: async (params:ReactQueryFnProps<ArticleFilterParams>)
  :Promise<Article[]> => getArticles(params.queryKey[1]),
};
