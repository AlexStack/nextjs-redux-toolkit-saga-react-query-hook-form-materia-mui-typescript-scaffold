import type { NextPage } from 'next';
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';

const Home:NextPage = () => (
  <Container maxWidth="sm">
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Next.js example
      </Typography>
      <Link href="/articles" color="secondary">
        Go to the about page
      </Link>
    </Box>
  </Container>
);

export default Home;
