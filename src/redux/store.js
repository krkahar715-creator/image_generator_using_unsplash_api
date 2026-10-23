import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./features/searchslice.js";

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});