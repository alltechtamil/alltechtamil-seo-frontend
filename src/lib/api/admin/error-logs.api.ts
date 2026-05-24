import { adminClient } from "../adminClient";
import { ApiResponse, PaginatedResponse } from "../../../types/api.types";
import { ErrorLog } from "../../../types/error-log.types";

/**
 * Fetch paginated application error telemetry.
 */
export const getAdminErrorLogs = async (
  page: number = 1,
  limit: number = 50,
  level?: string
): Promise<PaginatedResponse<ErrorLog>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (level) params.append("level", level);

    const response = await adminClient.get<PaginatedResponse<ErrorLog>>(
      `/diagnostics/error-logs?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Permanently purge all historical error telemetry logs.
 */
export const clearAllErrorLogs = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.delete<ApiResponse<null>>("/diagnostics/error-logs/clear");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Bulk delete specific error logs by ID.
 */
export const bulkDeleteErrorLogs = async (ids: string[]): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.post<ApiResponse<null>>("/diagnostics/error-logs/bulk-delete", {
      ids,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
