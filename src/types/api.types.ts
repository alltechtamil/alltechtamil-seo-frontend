/**
 * Standard API Response template matching the backend's ApiResponse utility structure.
 */
export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: unknown;
  correlation_id?: string;
  timestamp: string;
  debug_info?: {
    file: string;
    function: string;
  };
}

/**
 * Standard Paginated Response wrapping list arrays.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Standard API error structure.
 */
export interface ApiError {
  success: false;
  status_code: number;
  message: string;
  errors?: unknown;
  correlation_id: string;
  timestamp: string;
  debug_info?: {
    file: string;
    function: string;
  };
}
