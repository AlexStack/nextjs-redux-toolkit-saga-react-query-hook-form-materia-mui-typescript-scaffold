import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface userSliceType {
  visitorIdentityToken: string;
}

const initialState: userSliceType = {
  visitorIdentityToken: '',
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    visit: (state, action: PayloadAction<string>) => {
      state.visitorIdentityToken = action.payload;
    },
  },
});

export default userSlice;