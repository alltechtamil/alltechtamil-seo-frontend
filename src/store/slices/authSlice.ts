import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../../types/user.types";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuth,
  setAccessToken,
  clearAuth,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
