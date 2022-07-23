import React from 'react';
import {
  IconButton, Divider, List, ListItem,
  ListItemAvatar, ListItemText, Typography, Breadcrumbs, Button, Tooltip, Alert, Snackbar,
} from '@mui/material';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Image from 'next/image';
import type { FavoriteItem, UserSliceType } from '../types/article-types';
import { getArticleLink } from '../helpers/article-helper';
import { ReduxState } from '../redux/store';
import userSlice from '../redux/features/userSlice';

const RecentItems = () => {
  const reduxDispatch = useDispatch();

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const dataItems = reduxUserData.recentItems;

  const onClickFavorite = (item: FavoriteItem) => {
    reduxDispatch(userSlice.actions.favoriteItemRequest(item));
    setOpenSnackbar(true);
  };

  const onCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          href="/"
        >
          <Button variant="text" startIcon={<HomeIcon />}>
            Home
          </Button>
        </Link>
        <Link
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          <Button variant="text" startIcon={<PersonIcon />}>
            User
          </Button>

        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          <Button variant="text" startIcon={<RestoreIcon />}>
            Recent viewed
          </Button>

        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h1"
        component="div"
        gutterBottom
        align="center"
        sx={{ fontSize: '3rem', fontWeight: 700 }}
      >
        Recent Viewed Articles
      </Typography>

      <List sx={{
        width: '100%', maxWidth: 1000, marginTop: 5, bgcolor: 'background.paper',
      }}
      >
        {dataItems && dataItems.map((item) => {
          const isFavorite = reduxUserData.favoriteItems.some((f) => item.id === f.id);

          return (
            <>
              <ListItem
                alignItems="flex-start"
                secondaryAction={(
                  <Tooltip
                    title={isFavorite ? 'Remove it from my favorites' : 'Favorite it!'}
                    placement="left"
                  >
                    <IconButton
                      edge="end"
                      color={isFavorite ? 'error' : 'default'}
                      onClick={() => onClickFavorite(item)}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                )}
                key={item.id}
              >

                <ListItemAvatar sx={{ paddingRight: '1rem' }}>
                  <Image
                    src={item.cover_image}
                    alt={item.author}
                    width={150}
                    height={80}
                  />
                </ListItemAvatar>
                <Link href={getArticleLink(item)}>
                  <ListItemText
                    primary={<Typography variant="h6">{item.title}</Typography>}
                    sx={{ cursor: 'pointer' }}
                    secondary={(
                      <>
                        <Typography
                          sx={{ display: 'inline', paddingRight: '0.5rem' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {item.author}
                        </Typography>
                        Viewed at:
                        <Typography
                          sx={{ display: 'inline', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >

                          {item.visited_at}
                        </Typography>
                        Tags:
                        <Typography
                          sx={{ display: 'inline', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {item.tags?.join(',')}
                        </Typography>
                        <Typography
                          sx={{ display: 'block' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {item.description}
                        </Typography>
                      </>
                    )}
                  />
                </Link>
              </ListItem>
              <Divider variant="inset" component="li" />

            </>
          );
        })}

      </List>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={onCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={onCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Action performed successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default RecentItems;
