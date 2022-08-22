import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import { ChildrenProps } from '../types/article-types';

const MainLayout = ({ children }: ChildrenProps) => (
  <>
    <CssBaseline />
    <Container maxWidth="xl">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <MainHeader />
        <Box flex={1} overflow="auto" justifyContent="space-around" style={{ minHeight: '80vh', width: '90vw' }}>
          {children}
        </Box>

        <MainFooter />
      </Grid>
    </Container>
  </>
);

export default MainLayout;
