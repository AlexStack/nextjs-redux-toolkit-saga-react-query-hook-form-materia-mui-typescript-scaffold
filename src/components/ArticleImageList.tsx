import React from 'react';
// import Image from 'next/image';
import {
  ImageList, ImageListItem, ListSubheader, ImageListItemBar, IconButton,
} from '@mui/material';
import Link from 'next/link';
import type { Article } from '../types/article-types';
import { getArticleImgUrl, getArticleLink } from '../helpers/article-helper';

interface Props {
  dataItems: Article[];
}

const ArticleImageList = ({ dataItems }:Props) => (
  <ImageList cols={2} gap={18}>
    <ImageListItem key="Subheader" cols={2}>
      <ListSubheader component="div">articles</ListSubheader>
    </ImageListItem>
    {dataItems && dataItems.map((item) => {
      const imageUrl = getArticleImgUrl(item);
      return (
        <Link href={getArticleLink(item)} key={item.id}>
          <ImageListItem key={item.id} sx={{ cursor: 'pointer' }}>
            <img
              src={imageUrl}
              srcSet={`${imageUrl}&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={item.user.name}
              actionIcon={(
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.title}`}
                >
                  I
                </IconButton>
              )}
            />
          </ImageListItem>
        </Link>
      );
    })}
  </ImageList>

);

export default ArticleImageList;
