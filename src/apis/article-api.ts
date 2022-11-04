import axios from 'axios';
import { BASE_API_URI, ITEMS_PER_PAGE } from '../constants/article-const';
import { Article, ArticleFilterParams, ArticleDetailParams } from '../types/article-types';

interface ReactQueryFnProps<T> {
  queryKey: [string, T];
}

const axiosInstance = axios.create({
  baseURL: `${BASE_API_URI}/`,
  timeout: 4999,
});

export const getArticles = async ({ tag = 'react', page = 1 }:ArticleFilterParams):Promise<Article[]> => {
  const apiEndpoint = `articles?tag=${tag}&page=${page}&per_page=${ITEMS_PER_PAGE}`;
  const response    = await axiosInstance.get(apiEndpoint);
  // console.log('🚀 ~ file: article-api.ts ~ line 12 ~ getArticles ~ apiEndpoint', apiEndpoint);
  return response.data;
};

export const getArticleDetail = async ({ id }:ArticleDetailParams):Promise<Article | null> => {
  const apiEndpoint = `articles/${id}`;
  try {
    const response = await axiosInstance.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.log('🚀 ~ file: article-api.ts ~ line 27 ~ getArticleDetail ~ apiEndpoint', apiEndpoint, error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        // Do something for timeout ...
      }
    }
  }

  return null;
};

export const reactQueryFn = {
  getArticles: async (params:ReactQueryFnProps<ArticleFilterParams>)
  :Promise<Article[]> => getArticles(params.queryKey[1]),

  getArticleDetail: async (params:ReactQueryFnProps<ArticleDetailParams>)
  :Promise<Article | null> => getArticleDetail(params.queryKey[1]),
};
