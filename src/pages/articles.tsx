import type { GetStaticProps, NextPage } from 'next';
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
// import Image from 'next/image';
import {
  ImageList, ImageListItem, ListSubheader, ImageListItemBar, IconButton,
} from '@mui/material';
import type { Article } from '../types/article-types';
// import Link from '@mui/material/Link';

const Articles: NextPage = (props) => {
  console.log('🚀 ~ file: articles.tsx ~ line 10 ~ props', props);
  const itemData: Article[] = props?.articles;
  const defaultImage = 'https://res.cloudinary.com/practicaldev/image/fetch/s--i4DSNzLJ--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5mooe0y4lju8ba7yjwco.png?w=248&fit=crop&auto=format';
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>

        <ImageList cols={2} gap={18}>
          <ImageListItem key="Subheader" cols={2}>
            <ListSubheader component="div">December</ListSubheader>
          </ImageListItem>
          {itemData.map((item) => (
            <ImageListItem key={item.id}>
              <img
                src={`${item.cover_image || defaultImage}?w=248&fit=crop&auto=format`}
                srcSet={`${item.cover_image || defaultImage}?w=248&fit=crop&auto=format&dpr=2 2x`}
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

        <Link href="/" color="secondary">Back to home</Link>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // fetch data from external API
  const apiEndpoint = 'https://dev.to/api/articles?tag=react';
  const response = await fetch(apiEndpoint);
  const data = await response.json();

  console.log('🚀 ~ file: articles.tsx ~ line 27 ~ constgetStaticProps:GetStaticProps= ~ data', data);
  // return props with data for the page
  return {
    props: {
      articles: (data || []) as Article[],
    },
  };
};

export default Articles;
