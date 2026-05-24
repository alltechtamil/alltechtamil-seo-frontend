import axios, { AxiosError } from "axios";
import { ApiError } from "../../types/api.types";
import { envConfig } from "../../config/env.config";

/**
 * Axios instance targeting public v1 blog operations.
 * Operates withCredentials: false since no authentication sessions are required.
 */
export const publicClient = axios.create({
  baseURL: `${envConfig.apiUrl}/api/v1/public`,
  withCredentials: false,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response Interceptor: Standardized public error normalization wrapper.
 */
publicClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || "Something went wrong";

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

export default publicClient;
