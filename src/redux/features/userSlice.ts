import { createSlice } from '@reduxjs/toolkit';

interface UserSliceType {
  visitorIdentityToken: string;
  visitedTimes: number;
}

const initialState: UserSliceType = {
  visitorIdentityToken: '',
  visitedTimes        : 1,
};

const userSlice = createSlice({
  name    : 'user',
  initialState,
  reducers: {
    visitRequest: (state) => {
      if (state.visitorIdentityToken === '') {
        state.visitorIdentityToken = `random-token-${new Date()}`;
      }

      state.visitedTimes += 1;
    },
  },
});

export default userSlice;
