import axios from 'axios';
import { BASE_API_URI } from '../constants/article-const';
import { Article } from '../types/article-types';

type Props = {
  queryKey: [string, { tag?: string, page?: number }];
}

export const getArticles = async (params:Props):Promise<Article[]> => {
  const [, { tag = 'redux', page = 1 }] = params.queryKey;
  const apiEndpoint  = `${BASE_API_URI}/articles?tag=${tag}&page=${page}`;
  const response     = await axios.get(apiEndpoint);
  return response.data;
};

export const getVideos = async (params:Props):Promise<Article[]> => {
  const [, { tag = 'redux', page = 1 }] = params.queryKey;
  const apiEndpoint  = `${BASE_API_URI}/videos?tag=${tag}&page=${page}`;
  const response     = await axios.get(apiEndpoint);
  return response.data;
};
