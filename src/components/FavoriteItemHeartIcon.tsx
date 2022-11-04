import React, { useState } from 'react';
import {
  IconButton, SxProps, Theme, Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import type { Article, FavoriteItem, UserSliceType } from '../types/article-types';
import { ReduxState } from '../redux/store';
import userSlice from '../redux/features/userSlice';
import ActionToaster from './ActionToaster';

interface FavoriteItemHeartIconProps {
  item: Article | FavoriteItem;
  itemName?: string;
  iconButtonSx?: SxProps<Theme> | undefined;
}

const FavoriteItemHeartIcon = ({ item, itemName = 'article', iconButtonSx }: FavoriteItemHeartIconProps) => {
  const reduxDispatch = useDispatch();

  const reduxUserData:UserSliceType = useSelector((reduxState: ReduxState) => reduxState.user);

  const isFavorite = reduxUserData.favoriteItems.some(
    (favoriteItem) => item.id === favoriteItem.id,
  );

  const [showToaster, setShowToaster] = useState(false);

  const onClickFavorite = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    reduxDispatch(userSlice.actions.favoriteItemRequest(item));
    setShowToaster(true);
  };

  const IconButtonSx = iconButtonSx ?? {
    position  : 'absolute',
    top       : '0.5rem',
    right     : '0.5rem',
    background: 'rgba(255, 255, 255, 0.4)',
    ':hover'  : {
      background: 'rgba(255, 255, 255, 0.8)',
    },
  };

  return (
    <>
      <Tooltip
        title={isFavorite ? `Remove this ${itemName} from my favorites` : `Favorite this ${itemName}!`}
        placement="left"
        PopperProps={{
          modifiers: [
            {
              name   : 'offset',
              options: {
                offset: [0, 3],
              },
            },
          ],
        }}
      >
        <IconButton
          aria-label="like"
          color={isFavorite ? 'error' : 'default'}
          onClick={(e) => onClickFavorite(e)}
          sx={IconButtonSx}
        >

          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Tooltip>

      <ActionToaster
        showToaster={showToaster}
        setShowToaster={setShowToaster}
        message={`This ${itemName} ${isFavorite ? 'added' : 'removed'} to your favorites`}
        alertColor={isFavorite ? 'success' : 'warning'}
      />

    </>
  );
};
export default FavoriteItemHeartIcon;
