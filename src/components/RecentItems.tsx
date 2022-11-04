import React from 'react';
import {
  IconButton, Divider, List, ListItem, Avatar, Tooltip, styled,
  ListItemAvatar, ListItemText, Typography, Breadcrumbs, Button, Box,
} from '@mui/material';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ChildrenProps, FavoriteItem, UserSliceType } from '../types/article-types';
import { getArticleImgUrl, getArticleLink } from '../helpers/article-helper';
import { ReduxState } from '../redux/store';
import userSlice from '../redux/features/userSlice';
import ActionToaster from './ActionToaster';

const StyledList = styled(List)({
  '& .MuiListItem-root:hover': {
    backgroundColor: '#f1ebeb',
  },
});

dayjs.extend(relativeTime);

const fromDate = (date?: string) => {
  if (!date) {
    return 'n/a';
  }
  return dayjs().from(dayjs(date));
};

export const PageBreadcrumbs = ({ children }:ChildrenProps) => (
  <Breadcrumbs aria-label="breadcrumb">
    <Link href="/">
      <Button variant="text" startIcon={<HomeIcon />}>
        Home
      </Button>
    </Link>
    <Link href="/">
      <Button variant="text" startIcon={<PersonIcon />}>
        User
      </Button>
    </Link>
    <Typography
      sx={{ display: 'flex', alignItems: 'center' }}
      color="text.primary"
    >
      {children}
    </Typography>
  </Breadcrumbs>
);

interface PageListItemsProps {
  dataItems:FavoriteItem[];
  onClickFavorite:(item:FavoriteItem) => void;
  allFavoriteItems?:FavoriteItem[];
  isRecentPage:boolean;
}

export const PageListItems = ({
  dataItems, onClickFavorite, allFavoriteItems, isRecentPage,
}:PageListItemsProps) => (
  <>
    <Typography
      variant="h1"
      component="div"
      gutterBottom
      align="center"
      sx={{ fontSize: '3rem', fontWeight: 700 }}
    >
      {isRecentPage ? 'Recent Viewed' : 'My Favorites'}
    </Typography>
    <StyledList sx={{
      width: '100%', maxWidth: 1000, marginTop: 5, bgColor: 'background.paper',
    }}
    >
      {dataItems && dataItems.map((item) => {
        const isFavorite = allFavoriteItems
          ? allFavoriteItems.some((f) => item.id === f.id) : false;

        const favoritePageToolTipText = 'Remove it from my favorites';
        const recentPageToolTipText   = isFavorite ? favoritePageToolTipText : 'Favorite it!';

        const toolTipText = isRecentPage ? recentPageToolTipText : favoritePageToolTipText;

        return (
          <>
            <ListItem
              alignItems="flex-start"
              secondaryAction={(
                <Tooltip title={toolTipText} placement="left">
                  <IconButton
                    edge="end"
                    color={isFavorite ? 'error' : 'default'}
                    onClick={() => onClickFavorite(item)}
                  >
                    { isRecentPage ? <FavoriteIcon /> : <DeleteIcon />}
                  </IconButton>
                </Tooltip>
              )}
              key={item.id}
              sx={{
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <ListItemAvatar sx={{ paddingRight: '1rem' }}>
                { isRecentPage ? (
                  <Image
                    src={getArticleImgUrl(item)}
                    alt={item.author}
                    width={250}
                    height={120}
                  />
                ) : (
                  <Avatar alt={item.author} src={item.author_avatar} />
                )}
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
                      {isRecentPage ? 'Viewed at:' : 'Favorited at:'}
                      <Typography
                        sx={{ display: 'inline', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {isRecentPage ? fromDate(item.visited_at) : fromDate(item.favorite_at)}
                      </Typography>
                      <Box sx={{ display: { xs: 'none', md: 'inline-block' } }}>
                        Tags:
                        <Typography
                          sx={{ display: 'inline', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {Array.isArray(item.tags) ? item.tags.join(', ') : item.tags}
                        </Typography>
                      </Box>
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
    </StyledList>
  </>
);

const RecentItems = () => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const dataItems = reduxUserData.recentItems;

  const [showToaster, setShowToaster] = React.useState(false);

  const onClickFavorite = (item: FavoriteItem) => {
    reduxDispatch(userSlice.actions.favoriteItemRequest(item));
    setShowToaster(true);
  };

  return (
    <>
      <PageBreadcrumbs>
        <Button variant="text" startIcon={<RestoreIcon />}>Recent viewed</Button>
      </PageBreadcrumbs>

      <PageListItems
        dataItems={dataItems}
        onClickFavorite={onClickFavorite}
        allFavoriteItems={reduxUserData.favoriteItems}
        isRecentPage
      />

      <ActionToaster showToaster={showToaster} setShowToaster={setShowToaster} />
    </>
  );
};

export default RecentItems;
