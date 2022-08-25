import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import { ChildrenProps } from '../types/article-types';

const MainLayout = ({ children }: ChildrenProps) => (
  <>
    <CssBaseline />
    <Container maxWidth="xl" sx={{ padding: 0, width: '100vw' }}>

      <MainHeader />
      <Box flex={1} overflow="auto" justifyContent="space-around" style={{ minHeight: '80vh', width: '90vw', margin: '0 auto' }}>
        {children}
      </Box>

      <MainFooter />

    </Container>
  </>
);

export default MainLayout;
