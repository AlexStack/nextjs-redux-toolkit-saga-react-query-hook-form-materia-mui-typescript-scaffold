import { DEFAULT_IMAGE_URL } from '../constants/article-const';
import { Article } from '../types/article-types';

export const getArticleLink = (article: Article) => `/articles/${article.slug}-${article.id}`;

export const getArticleImgUrl = (article: Article) => (article.cover_image ? `${article.cover_image}?w=248&fit=crop&auto=format` : DEFAULT_IMAGE_URL + (article.tag_list.join(',') || 'No cover image'));
