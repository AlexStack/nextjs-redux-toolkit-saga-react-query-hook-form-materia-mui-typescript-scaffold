import type { NextPage } from 'next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import FavoriteItems from '../../components/FavoriteItems';

const UserFavorite: NextPage = () => (
  <MainLayout>
    <FavoriteItems />
  </MainLayout>
);

export default UserFavorite;
