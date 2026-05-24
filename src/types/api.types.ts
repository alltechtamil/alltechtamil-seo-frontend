/**
 * Standard API Response template matching the backend's ApiResponse utility structure.
 */
export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCount?: number;
  currentPage?: number;
  perPage?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
  meta?: PaginationMetadata;
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
  meta: PaginationMetadata;
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
