import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';
import Person from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import { TOP_MENU_TAGS, USER_MENU_LINKS } from '../constants/article-const';
import { getTagLink } from '../helpers/article-helper';
import { ReduxState } from '../redux/store';
import { UserSliceType } from '../types/article-types';

const MainHeader = () => {
  const [anchorElNav, setAnchorElNav]   = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const handleOpenNavMenu  = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link href="/">
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr            : 2,
                display       : { xs: 'none', md: 'flex' },
                fontFamily    : 'monospace',
                fontWeight    : 700,
                letterSpacing : '.1rem',
                color         : 'inherit',
                textDecoration: 'none',
                cursor        : 'pointer',
              }}
            >
              React
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical  : 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical  : 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {TOP_MENU_TAGS.map((tag) => (
                <MenuItem key={tag} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link href={getTagLink(tag)} passHref>
                      {tag}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr            : 2,
              display       : { xs: 'flex', md: 'none' },
              flexGrow      : 1,
              fontFamily    : 'monospace',
              fontWeight    : 700,
              letterSpacing : '.3rem',
              color         : 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {TOP_MENU_TAGS.map((tag) => (
              <Link href={getTagLink(tag)} passHref key={tag}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2, color: 'white', display: 'block', textTransform: 'none',
                  }}
                >
                  {tag}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open user menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {reduxUserData?.profile?.avatarUrl ? (
                  <Avatar src={reduxUserData.profile.avatarUrl} />
                ) : (
                  <Avatar alt="Alex">
                    <Person />
                  </Avatar>
                ) }

              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical  : 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical  : 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {USER_MENU_LINKS.map((menuLink) => (
                <MenuItem key={menuLink.title} onClick={handleCloseUserMenu}>
                  <Link href={menuLink.url}>
                    <Typography textAlign="center">{menuLink.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainHeader;
