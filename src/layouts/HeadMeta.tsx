import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Article, PageMeta } from '../types/article-types';
import { SITE_NAME } from '../constants/article-const';

interface Props extends PageMeta {
  article?: Article;
}

const HeadMeta = ({
  title,
  url,
  article,
  description = article?.description ? article.description : undefined,
  type = article?.title ? 'article' : 'website',
  image = article?.social_image ? article.social_image : undefined,
  keywords = Array.isArray(article?.tags) ? article?.tags : undefined,
  locale = 'en',
}: Props) => {
  const { asPath } = useRouter();
  const siteName   = SITE_NAME;
  const pageTitle  = title ? `${title} - ${siteName}` : siteName;
  const currentUrl = `${url || asPath}`;

  return (

    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords?.join(',')} />}

      {/* Open Graph */}
      {url && <meta property="og:url" content={currentUrl} key="url" />}
      {image && <meta property="og:image" content={image} key="image" />}
      {siteName && <meta property="og:site_name" content={siteName} key="siteName" />}
      {title && <meta property="og:title" content={title} key="title" />}
      {description && <meta property="og:description" content={description} key="description" />}
      {type && <meta property="og:type" content={type} />}
      {locale && <meta property="og:locale" content={locale} />}

    </Head>
  );
};

export default HeadMeta;
