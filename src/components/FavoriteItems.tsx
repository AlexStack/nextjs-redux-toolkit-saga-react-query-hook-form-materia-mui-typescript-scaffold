import React from 'react';
import {
  IconButton, Avatar, Divider, List, ListItem,
  ListItemAvatar, ListItemText, Typography, Breadcrumbs, Button, Tooltip,
} from '@mui/material';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

import type { FavoriteItem, UserSliceType } from '../types/article-types';
import { getArticleLink } from '../helpers/article-helper';
import { ReduxState } from '../redux/store';
import userSlice from '../redux/features/userSlice';

const FavoriteItems = () => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const dataItems = reduxUserData.favoriteItems;

  const onClickFavorite = (item: FavoriteItem) => {
    reduxDispatch(userSlice.actions.favoriteItemRequest(item));
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
          <Button variant="text" startIcon={<FavoriteIcon />}>
            Favorites
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
        My Favorites
      </Typography>

      <List sx={{
        width: '100%', maxWidth: 1000, marginTop: 5, bgcolor: 'background.paper',
      }}
      >
        {dataItems && dataItems.map((item) => (
          <>
            <ListItem
              alignItems="flex-start"
              secondaryAction={(
                <Tooltip title="Remove from my favorites" placement="left">
                  <IconButton
                    edge="end"
                    aria-label="remove from my favorites"
                    color="default"
                    onClick={() => onClickFavorite(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              key={item.id}
            >

              <ListItemAvatar>
                <Avatar alt={item.author} src={item.author_avatar} />
              </ListItemAvatar>
              <Link href={getArticleLink(item)}>
                <ListItemText
                  primary={item.title}
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
                      Favorite at:
                      <Typography
                        sx={{ display: 'inline', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >

                        {item.favorite_at}
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
        ))}

      </List>

    </>
  );
};

export default FavoriteItems;
