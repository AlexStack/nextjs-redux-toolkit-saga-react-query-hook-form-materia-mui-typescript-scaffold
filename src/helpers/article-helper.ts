import { DEFAULT_IMAGE_URL } from '../constants/article-const';
import { Article } from '../types/article-types';

export const getArticleLink = (article: Article) => `/articles/${article.slug}-${article.id}`;

export const getArticleImgUrl = (article: Article) => {
  const tagStr = typeof article.tag_list === 'string' ? article.tag_list : article.tag_list.join(',');

  return (article.cover_image ? `${article.cover_image}?w=248&fit=crop&auto=format` : DEFAULT_IMAGE_URL + (tagStr || 'No cover image'));
};

export const convertArticleToFavoriteItem = (article: Article) => {
  const item = {
    id           : article.id,
    title        : article.title,
    description  : article.description,
    tags         : article.tags,
    cover_image  : article.cover_image,
    slug         : article.slug,
    published_at : article.published_at,
    visited_at   : new Date().toISOString(),
    author       : article.user.name,
    author_avatar: article.user.profile_image_90,
  };
  return item;
};
