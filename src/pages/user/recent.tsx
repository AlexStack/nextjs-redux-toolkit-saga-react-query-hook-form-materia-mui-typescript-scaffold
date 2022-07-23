import type { NextPage } from 'next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import RecentItems from '../../components/RecentItems';

const UserRecent: NextPage = () => (
  <MainLayout>
    <RecentItems />
  </MainLayout>
);

export default UserRecent;
