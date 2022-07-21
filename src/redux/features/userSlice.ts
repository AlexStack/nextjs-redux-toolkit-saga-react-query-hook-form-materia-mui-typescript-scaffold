import { createSlice } from '@reduxjs/toolkit';

interface UserSliceType {
  visitorIdentityToken: string;
}

const initialState: UserSliceType = {
  visitorIdentityToken: '',
};

const userSlice = createSlice({
  name    : 'user',
  initialState,
  reducers: {
    visitRequest: (state) => {
      state.visitorIdentityToken = 'random-token';
    },
  },
});

export default userSlice;
