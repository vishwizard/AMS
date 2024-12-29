import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // No need to manually add Redux DevTools extension
});