import axios from 'axios';
import { BASE_API_URI } from '../constants/article-const';
import { Article, ArticleFilterParams } from '../types/article-types';

interface Props {
  queryKey: [string, ArticleFilterParams];
}

interface reactQueryFnProps<T> {
  queryKey: [string, T];
}

// export const getArticles = async (params:Props):Promise<Article[]> => {
//   const [, { tag, page }] = params.queryKey;
//   return _getArticles({tag, page});
// };

export const getArticles = async ({tag = 'react', page = 1}:ArticleFilterParams):Promise<Article[]> => {
  const apiEndpoint  = `${BASE_API_URI}/articles?tag=${tag}&page=${page}`;
  const response     = await axios.get(apiEndpoint);
  return response.data;
};

export const reactQueryFn = {
  getArticles: async (params:reactQueryFnProps<ArticleFilterParams>):Promise<Article[]> => {
    return getArticles(params.queryKey[1]);
  },
};

export const getVideos = async (params:Props):Promise<Article[]> => {
  const [, { tag = 'redux', page = 1 }] = params.queryKey;
  const apiEndpoint  = `${BASE_API_URI}/videos?tag=${tag}&page=${page}`;
  const response     = await axios.get(apiEndpoint);
  return response.data;
};
