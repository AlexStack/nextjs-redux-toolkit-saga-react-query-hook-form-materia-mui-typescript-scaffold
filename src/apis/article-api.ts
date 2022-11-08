import axios from 'axios';
import { mainConfig } from '../configs/main-config';
import { ITEMS_PER_PAGE } from '../constants/article-const';
import { Article, ArticleFilterParams, ArticleDetailParams } from '../types/article-types';
import { consoleLog } from '../utils/console-log';

interface ReactQueryFnProps<T> {
  queryKey: [string, T];
}

export const getArticles = async ({ tag = 'react', page = 1 }:ArticleFilterParams):Promise<Article[]> => {
  const apiEndpoint = `${mainConfig.siteUri}/api/article-tag?tag=${tag}&page=${page}&per_page=${ITEMS_PER_PAGE}`;

  try {
    const response = await axios.get(apiEndpoint);

    return response.data;
  } catch (error) {
    consoleLog('🚀 ~ file: article-api.ts ~ line 46 ~ getArticles ~ apiEndpoint', apiEndpoint, error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        // Do something for timeout ...
      }
    }
  }
  return [];
};

export const getArticleDetail = async ({ id }:ArticleDetailParams):Promise<Article | null> => {
  const apiEndpoint = `${mainConfig.siteUri}/api/article-detail?id=${id}`;
  try {
    const response = await axios.get(apiEndpoint);

    return response.data;
  } catch (error) {
    consoleLog('🚀 ~ file: article-api.ts ~ line 27 ~ getArticleDetail ~ apiEndpoint', apiEndpoint, error);
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
