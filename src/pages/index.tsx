import type { NextPage } from 'next';
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import MainLayout from '../layouts/MainLayout';

const Home:NextPage = () => (
  <MainLayout>
    <Typography variant="h4" component="h1">
      Welcome to Next.js!
    </Typography>
    <Box my={4} flex={1} overflow="auto">
      <Link href="/articles">
        Articles
      </Link>
    </Box>
    <Box>
      The scaffold for NextJs 12.x,Redux Toolkit,Redux Saga,React Query,React Hook Form,
      Material UI(mui),Typescript and ESLint
    </Box>
  </MainLayout>
);

export default Home;
