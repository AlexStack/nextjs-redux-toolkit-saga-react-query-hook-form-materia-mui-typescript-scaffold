import React from 'react';
// import Image from 'next/image';
import {
  ImageList, ImageListItem, ListSubheader, ImageListItemBar, IconButton,
} from '@mui/material';
import type { Article } from '../types/article-types';
import { DEFAULT_IMAGE_URL } from '../constants/article-const';
// import Link from '@mui/material/Link';

interface Props {
  dataItems: Article[];
}

const ArticleImageList = ({ dataItems }:Props) => (

  <ImageList cols={2} gap={18}>
    <ImageListItem key="Subheader" cols={2}>
      <ListSubheader component="div">articles</ListSubheader>
    </ImageListItem>
    {dataItems && dataItems.map((item) => (
      <ImageListItem key={item.id}>
        <img
          src={`${item.cover_image || DEFAULT_IMAGE_URL}?w=248&fit=crop&auto=format`}
          srcSet={`${item.cover_image || DEFAULT_IMAGE_URL}?w=248&fit=crop&auto=format&dpr=2 2x`}
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
    ))}
  </ImageList>

);

export default ArticleImageList;
