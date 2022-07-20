import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { Article } from "../../types/article-types";

interface articleSliceType {
  lists: Article[];
  status: "loading" | "loaded" | "error" | "";
  message?: string;
}

const initialState: articleSliceType = {
  lists: [],
  status: "",
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    getArticlesRequest: (state, action: PayloadAction<{page:number, tag:string}>) => {
      state.status = "loading";
    },
    getArticlesSuccess: (state, action: PayloadAction<Article[]>) => {
      state.lists = action.payload;
      state.status = "loaded";
    },
    getArticlesFailure: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.message = action.payload;
    },
  },
});

export default articleSlice;