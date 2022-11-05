import type { NextPage } from 'next';
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import MainLayout from '../layouts/MainLayout';
import HeadMeta from '../layouts/HeadMeta';
import SearchBar from '../components/SearchBar';

const Home:NextPage = () => (
  <MainLayout>
    <HeadMeta
      title="Scaffold for Redux + NextJs + Typescript"
      description="The scaffold for NextJs 12.x,Redux Toolkit,Redux Saga,React Query,React Hook Form, Material UI(mui),Typescript and ESLint"
    />
    <Typography variant="h2" component="h2">
      Welcome to Next.js!
    </Typography>
    <Box my={4} flex={1} overflow="auto">
      <Link href="/articles/tag/React" passHref>
        React Articles
      </Link>
    </Box>

    <SearchBar />

    <Box sx={{ marginTop: 5 }}>
      The scaffold for NextJs 12.x,Redux Toolkit,Redux Saga,React Query,React Hook Form,
      Material UI(mui),Typescript and ESLint
    </Box>
  </MainLayout>
);

export default Home;
