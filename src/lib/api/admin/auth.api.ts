import { adminClient } from "../adminClient";
import { ApiResponse } from "../../../types/api.types";
import {
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  User,
} from "../../../types/user.types";

/**
 * Perform administrator login, setting HttpOnly cookies on the backend
 * and returning the short-lived access token and initial user profile.
 */
export const login = async (
  credentials: LoginCredentials
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await adminClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Revoke the current active refresh session and wipe browser authentication cookies.
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Trigger explicit token rotation. Usually handled transparently by interceptors,
 * but exposed for manual session check/re-verification.
 */
export const refreshToken = async (): Promise<ApiResponse<RefreshResponse>> => {
  try {
    const response = await adminClient.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a fresh, reactive copy of the logged-in administrator's profile.
 */
export const getMe = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await adminClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};
