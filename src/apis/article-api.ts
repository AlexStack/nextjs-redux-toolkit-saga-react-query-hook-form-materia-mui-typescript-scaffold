import axios from 'axios';
import { mainConfig } from '../configs/main-config';
import { BASE_API_URI, ITEMS_PER_PAGE } from '../constants/article-const';
import { Article, ArticleFilterParams, ArticleDetailParams } from '../types/article-types';
import { consoleLog } from '../utils/console-log';

const fs = require('fs');

interface ReactQueryFnProps<T> {
  queryKey: [string, T];
}

const axiosInstance = axios.create({
  baseURL: `${BASE_API_URI}/`,
  timeout: 4999,
  headers: {
    'Content-Type': 'application/json',
    // 'api-key'     : process.env.NEXT_PUBLIC_DEV_DOT_TO_API_KEY || 'Missing dev.to api key',
    accept        : 'application/vnd.forem.api-v1+json',
  },
});

export const getArticles = async ({ tag = 'react', page = 1 }:ArticleFilterParams):Promise<Article[]> => {
  const apiEndpoint = `articles?tag=${tag}&page=${page}&per_page=${ITEMS_PER_PAGE}`;
  // convert tag to file name
  const fileName = tag.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '_');
  const jsonFile = `${mainConfig.dataFilePath}/tag-${fileName}-${page}-${ITEMS_PER_PAGE}.json`;

  try {
    // read data from local json file first
    if (!mainConfig.isClientSide) {
      const fsStats = fs.statSync(jsonFile, { throwIfNoEntry: false });
      if (fsStats && 'mtime' in fsStats) {
        const articleData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        if (Array.isArray(articleData) && articleData.length && 'id' in articleData[0]) {
          return articleData;
        }
      }
    }

    const response = await axiosInstance.get(apiEndpoint);
    consoleLog('🚀 ~ file: article-api.ts ~ line 38 ~ getArticles ~ response', response);

    // save data to json file
    if (!mainConfig.isClientSide && Array.isArray(response.data) && response.data.length && 'id' in response.data[0] && 'title' in response.data[0]) {
      fs.writeFileSync(jsonFile, JSON.stringify(response.data), 'utf8');
    }

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

  // const response    = await axiosInstance.get(apiEndpoint);
  // consoleLog('🚀 ~ file: article-api.ts ~ line 12 ~ getArticles ~ apiEndpoint', apiEndpoint);
  // return response.data;
};

export const getArticleDetail = async ({ id }:ArticleDetailParams):Promise<Article | null> => {
  const apiEndpoint = `articles/${id}`;
  const jsonFile    = `${mainConfig.dataFilePath}/article-${id}.json`;
  try {
    // read data from local json file first
    const fsStats = fs.statSync(jsonFile, { throwIfNoEntry: false });
    if (fsStats && 'mtime' in fsStats) {
      // consoleLog('fs stats', fsStats);
      const articleData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      if ('id' in articleData) {
        return articleData;
      }
    }

    const response = await axiosInstance.get(apiEndpoint);

    // save data to json file
    if (('id' in response.data) && 'body_html' in response.data) {
      fs.writeFileSync(jsonFile, JSON.stringify(response.data), 'utf8');
    }

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
