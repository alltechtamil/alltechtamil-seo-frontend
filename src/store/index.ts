import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import blogEditorReducer from "./slices/blogEditorSlice";
import blogsReducer from "./slices/blogsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import tagsReducer from "./slices/tagsSlice";
import adsReducer from "./slices/adsSlice";
import analyticsReducer from "./slices/analyticsSlice";
import errorLogsReducer from "./slices/errorLogsSlice";

/**
 * Redux Toolkit global store configuration.
 * Placed here during Phase 1.11 initialization.
 * Reducers and slices will be attached here incrementally as they are created in Phase 4.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    blogEditor: blogEditorReducer,
    blogs: blogsReducer,
    categories: categoriesReducer,
    tags: tagsReducer,
    ads: adsReducer,
    analytics: analyticsReducer,
    errorLogs: errorLogsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents errors when working with dates or complex payloads in thunks
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;








