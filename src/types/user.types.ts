/**
 * User roles within the blogging platform.
 */
export type UserRole = "superadmin" | "editor";

/**
 * Full User profile schema representing database records.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Minimal user details exposed in active authentication sessions.
 */
export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
}

/**
 * Credentials payload sent on login requests.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Response structure returned from successful login operations.
 */
export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
    lastLoginAt: string | null;
  };
}

/**
 * Response structure returned from successful token rotation.
 */
export interface RefreshResponse {
  accessToken: string;
}

