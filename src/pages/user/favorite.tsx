import type { NextPage } from 'next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import FavoriteItems from '../../components/FavoriteItems';
import HeadMeta from '../../layouts/HeadMeta';

const UserFavorite: NextPage = () => (
  <MainLayout>
    <HeadMeta title="User Favorites" />
    <FavoriteItems />
  </MainLayout>
);

export default UserFavorite;
