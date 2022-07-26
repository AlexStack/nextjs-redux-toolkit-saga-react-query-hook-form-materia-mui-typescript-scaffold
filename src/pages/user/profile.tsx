import type { NextPage } from 'next';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import ProfileForm from '../../components/ProfileForm';

const UserProfile: NextPage = () => (
  <MainLayout>
    <ProfileForm />
  </MainLayout>
);

export default UserProfile;
