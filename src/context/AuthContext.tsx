"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setAuth,
  clearAuth,
  setLoading,
  setError,
} from "../store/slices/authSlice";
import {
  login as apiLogin,
  logout as apiLogout,
  getMe as apiGetMe,
} from "../lib/api/admin/auth.api";
import { LoginCredentials, AuthUser } from "../types/user.types";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiGetMe();
        const apiUser = response.data;
        
        // Grab refreshed accessToken from the store since the Axios interceptor
        // automatically populates it if it had to execute a silent rotation.
        // Lazy-loading the store state directly from module import ensures accuracy.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const currentAccessToken = require("../store").store.getState().auth.accessToken;

        dispatch(
          setAuth({
            accessToken: currentAccessToken || "",
            user: {
              id: apiUser.id,
              name: apiUser.name,
              role: apiUser.role,
              avatarUrl: apiUser.avatarUrl,
            },
          })
        );
      } catch {
        dispatch(clearAuth());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeSession();
  }, [dispatch]);

  const login = async (credentials: LoginCredentials) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await apiLogin(credentials);
      const { accessToken, user: apiUser } = response.data;
      dispatch(
        setAuth({
          accessToken,
          user: {
            id: apiUser.id,
            name: apiUser.name,
            role: apiUser.role,
            avatarUrl: apiUser.avatarUrl,
          },
        })
      );
    } catch (err) {
      const error = err as Error;
      const message = error.message || "Login failed";
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    dispatch(setLoading(true));
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      dispatch(clearAuth());
      dispatch(setLoading(false));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
