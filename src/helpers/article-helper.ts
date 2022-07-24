import { format, parseISO } from 'date-fns';
import { DEFAULT_IMAGE_URL } from '../constants/article-const';
import { Article, FavoriteItem } from '../types/article-types';

export const getArticleLink = (article: Article | FavoriteItem) => `/articles/${article.slug}-${article.id}`;

export const getArticleTags = (article: Article | FavoriteItem) => {
  let tagAry:string[] = article?.tags && Array.isArray(article.tags) ? article.tags : [];
  if (tagAry.length === 0) {
    tagAry = (
      article?.tag_list && (Array.isArray(article.tag_list)
        ? article.tag_list : article.tag_list.split(','))
    ) || [];
  }
  return tagAry.map((item) => {
    const w = item.trim();
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
};

export const getArticleImgUrl = (article: Article | FavoriteItem) => {
  const tagStr = getArticleTags(article).join(', ');

  const newImg = (article.cover_image ? `${article.cover_image}?w=248&fit=crop&auto=format` : DEFAULT_IMAGE_URL + (tagStr || 'No cover image'));

  const cloudinaryUrl = newImg.includes('cloudinary.com')
    ? newImg : `https://res.cloudinary.com/demo/image/fetch/${encodeURIComponent(newImg)}`;

  return cloudinaryUrl;
};

export const convertArticleToFavoriteItem = (article: Article) => {
  const item = {
    id           : article.id,
    title        : article.title,
    description  : article.description,
    tags         : article.tags,
    tag_list     : article.tags?.join(', ') || '',
    cover_image  : article.cover_image,
    slug         : article.slug,
    published_at : article.published_at,
    visited_at   : new Date().toISOString(),
    author       : article.user.name,
    author_avatar: article.user.profile_image_90,
  };
  return item;
};

export const getFormattedDate = (dateIso: string, formatStr = 'MM/dd/yyyy') => format(parseISO(dateIso), formatStr);
