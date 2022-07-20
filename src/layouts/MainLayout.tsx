import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import Grid from '@mui/material/Grid';

interface Props  {
  title?: string;
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <React.Fragment>
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
          <Box flex={1} overflow="auto" justifyContent='space-around' style={{ minHeight: '80vh' }}>
            {children}
          </Box>

          <MainFooter />
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default MainLayout;
