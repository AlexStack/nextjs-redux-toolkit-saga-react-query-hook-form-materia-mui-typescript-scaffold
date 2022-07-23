import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import styled from '@emotion/styled';
import router from 'next/router';

const MainFooter = () => {
  const StyledBottomNavigationAction = styled(BottomNavigationAction)(`
    color: #7e235a;
    &.Mui-selected {
      color: red;
    };
  `);

  const onIconClick = (url:string) => {
    router.push(url);
  };

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation showLabels>

        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => onIconClick('/')}
        />
        <StyledBottomNavigationAction
          label="Favorites"
          icon={<FavoriteIcon />}
          onClick={() => onIconClick('/user/favorite')}
        />
        <BottomNavigationAction
          label="Recent View"
          icon={<RestoreIcon />}
          onClick={() => onIconClick('/user/recent')}
        />

      </BottomNavigation>
    </Box>
  );
};

export default MainFooter;
