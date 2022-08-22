import type { NextPage } from 'next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import ProfileForm from '../../components/ProfileForm';
import HeadMeta from '../../layouts/HeadMeta';

const UserProfile: NextPage = () => (
  <MainLayout>
    <HeadMeta title="User Profile" />
    <ProfileForm />
  </MainLayout>
);

export default UserProfile;
