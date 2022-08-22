import type { NextPage } from 'next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import RecentItems from '../../components/RecentItems';
import HeadMeta from '../../layouts/HeadMeta';

const UserRecent: NextPage = () => (
  <MainLayout>
    <HeadMeta title="User recent view" />
    <RecentItems />
  </MainLayout>
);

export default UserRecent;
