import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "../../types/api.types";
import { clearAuth, setAccessToken } from "../../store/slices/authSlice";
import { envConfig } from "../../config/env.config";
import { ROUTES } from "../../constants/routes";

/**
 * Lazy resolve of Redux store to completely prevent circular dependency initialization errors.
 */
const getStore = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("../../store").store;
  } catch {
    return null;
  }
};

/**
 * Axios instance targeting protected administrator v1 operations.
 * Operates withCredentials: true to automatically pass cookie-secured refresh tokens.
 */
export const adminClient = axios.create({
  baseURL: `${envConfig.apiUrl}/api/v1/admin`,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor: Attach short-lived accessToken authorization headers dynamically.
 */
adminClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const store = getStore();
    const token = store?.getState()?.auth?.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token rotation and queue states
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response Interceptor: Seamlessly refresh expired tokens on 401 response and re-execute original request.
 */
adminClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const store = getStore();

    // Standardized Error Normalization
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Check if the route is a core authentication login/refresh to prevent loops
    const isAuthRoute =
      originalRequest?.url === "/auth/login" ||
      originalRequest?.url?.endsWith("/auth/login") ||
      originalRequest?.url === "/auth/refresh" ||
      originalRequest?.url?.endsWith("/auth/refresh");

    // On 401 error, try to perform silent token rotation
    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return adminClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token rotation - automatically passes refresh cookie
        const refreshResponse = await adminClient.post("/auth/refresh");
        const newAccessToken = refreshResponse.data?.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Failed to rotate access token.");
        }

        if (store) {
          store.dispatch(setAccessToken(newAccessToken));
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return adminClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        if (store) {
          store.dispatch(clearAuth());
        }

        if (typeof window !== "undefined" && window.location.pathname.startsWith(ROUTES.ADMIN)) {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(refreshError);
      }
    }

    // Return custom ApiError normalized output
    const apiError: ApiError = {
      success: false,
      status_code: status || error.response?.data?.status_code || 500,
      message,
      errors: error.response?.data?.errors || null,
      correlation_id: error.response?.data?.correlation_id || "",
      timestamp: error.response?.data?.timestamp || new Date().toISOString(),
      debug_info: error.response?.data?.debug_info,
    };

    return Promise.reject(apiError);
  }
);

export default adminClient;
