import React from 'react';
import {
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { FavoriteItem, UserSliceType } from '../types/article-types';
import { ReduxState } from '../redux/store';
import userSlice from '../redux/features/userSlice';
import { PageBreadcrumbs, PageListItems } from './RecentItems';
import ActionToaster from './ActionToaster';

const FavoriteItems = () => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const dataItems = reduxUserData.favoriteItems;

  const [showToaster, setShowToaster] = React.useState(false);

  const onClickFavorite = (item: FavoriteItem) => {
    reduxDispatch(userSlice.actions.favoriteItemRequest(item));
    setShowToaster(true);
  };

  return (
    <>
      <PageBreadcrumbs>
        <Button variant="text" startIcon={<FavoriteIcon />}>
          Favorites
        </Button>
      </PageBreadcrumbs>

      <PageListItems
        dataItems={dataItems}
        onClickFavorite={onClickFavorite}
        isRecentPage={false}
      />

      <ActionToaster
        showToaster={showToaster}
        setShowToaster={setShowToaster}
        message="Item removed from favorites"
        alertColor="info"
      />
    </>
  );
};

export default FavoriteItems;
