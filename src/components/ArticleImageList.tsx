import React from 'react';
import Image from 'next/image';
import {
  ImageList, ImageListItem, ImageListItemBar, IconButton, Typography,
} from '@mui/material';
import Link from 'next/link';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import type { Article } from '../types/article-types';
import { getArticleImgUrl, getArticleLink, getFormattedDate } from '../helpers/article-helper';

interface Props {
  tag: string;
  dataItems: Article[];
}

const ArticleImageList = ({ tag, dataItems }:Props) => (
  <ImageList cols={2} gap={18}>
    <ImageListItem key="Subheader" cols={2}>
      <Typography paragraph variant="h1" component="h1" sx={{ fontSize: '2rem', fontWeight: 600, textAlign: 'center' }}>
        {tag}
      </Typography>
    </ImageListItem>
    {dataItems && dataItems.map((item) => {
      const imageUrl = getArticleImgUrl(item);
      const subtitle = `${getFormattedDate(item.published_at)}, ${item.reading_time_minutes} minutes to read`;
      return (
        <Link href={getArticleLink(item)} key={item.id}>
          <ImageListItem key={item.id} sx={{ cursor: 'pointer' }}>
            <Image
              src={imageUrl}
              alt={item.title}
              width={900}
              height={400}
            />
            <ImageListItemBar
              title={item.title}
              subtitle={subtitle}
              actionIcon={(
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.title}`}
                >
                  <ReadMoreIcon />
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
