import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  ImageList, ImageListItem, ImageListItemBar, IconButton, Typography, Button, Box,
} from '@mui/material';
import Link from 'next/link';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import WarningIcon from '@mui/icons-material/Warning';
import { useWindowSize } from 'react-use';
import type { Article } from '../types/article-types';
import {
  getArticleImgUrl, getArticleLink, getFormattedDate,
} from '../helpers/article-helper';
import FavoriteItemHeartIcon from './FavoriteItemHeartIcon';

interface Props {
  tag: string;
  dataItems: Article[];
  onClickLoadMore: () => void;
  loading: boolean;
  isEndOfList: boolean;
}

const ArticleImageList = ({
  tag, dataItems, loading, isEndOfList, onClickLoadMore,
}:Props) => {
  const windowSize = useWindowSize();

  const [isSmallScreen, setIsSmallScreen] = React.useState(true);

  useEffect(() => {
    if (windowSize.width < 1000) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  }, [windowSize.width]);

  const imageItems = dataItems.filter((item) => item.cover_image && item.cover_image.trim() !== '');

  return (
    <ImageList cols={isSmallScreen ? 1 : 2} gap={isSmallScreen ? 0 : 16} sx={{ marginBottom: '8rem' }}>
      <ImageListItem key="Subheader" cols={2}>
        <Typography paragraph variant="h1" component="h1" sx={{ fontSize: '2rem', fontWeight: 600, textAlign: 'center' }}>
          {tag}
        </Typography>
      </ImageListItem>

      {imageItems && imageItems.map((item) => {
        const imageUrl = getArticleImgUrl(item);
        const subtitle = `${getFormattedDate(item.published_at)}, ${item.reading_time_minutes} minutes to read`;
        return (
          <Link href={getArticleLink(item)} key={item.id} prefetch={false}>
            <ImageListItem key={item.id} sx={{ cursor: 'pointer', marginBottom: '2rem' }}>
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
              <FavoriteItemHeartIcon item={item} />
            </ImageListItem>
          </Link>
        );
      })}

      <ImageListItem key="load-more" cols={2}>
        <Typography
          paragraph
          variant="h6"
          component="div"
          sx={{
            fontSize: '1rem', fontWeight: 400, textAlign: 'center', marginTop: '1rem',
          }}
        >
          {`Total ${imageItems.length} ${tag} articles`}
        </Typography>

        <Box textAlign="center">
          {isEndOfList ? (
            <Button
              variant="contained"
              disabled
              startIcon={<WarningIcon />}
              sx={{ width: '20rem', margin: '0.1rem 0 2rem 0' }}
            >
              It is the end of the list
            </Button>

          ) : (
            <Button
              variant="contained"
              disabled={loading}
              endIcon={<ReadMoreIcon />}
              onClick={onClickLoadMore}
              sx={{ width: '20rem', margin: '0.1rem 0 2rem 0' }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          )}

        </Box>
      </ImageListItem>
    </ImageList>

  );
};

export default ArticleImageList;
