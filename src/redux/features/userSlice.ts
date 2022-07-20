import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    visit: (state, action: PayloadAction<string>) => {
      state.visitorIdentityToken = action.payload;
    },
  },
});

export default userSlice;
