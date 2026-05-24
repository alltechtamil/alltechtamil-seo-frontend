import { adminClient } from "../adminClient";
import { ApiResponse } from "../../../types/api.types";
import {
  AnalyticsOverview,
  BlogAnalytics,
  SearchTrendItem,
} from "../../../types/analytics.types";

/**
 * Retrieve high-level analytics overview aggregated metrics for the Admin Dashboard.
 */
export const getAnalyticsOverview = async (): Promise<
  ApiResponse<AnalyticsOverview>
> => {
  try {
    const response = await adminClient.get<ApiResponse<AnalyticsOverview>>(
      "/dashboard"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve detailed traffic analytics for a single blog post by its unique UUID.
 */
export const getBlogStats = async (
  blogId: string
): Promise<ApiResponse<BlogAnalytics>> => {
  try {
    const response = await adminClient.get<ApiResponse<BlogAnalytics>>(
      `/analytics/blogs/${blogId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve trending visitor search query keywords with occurrence frequency.
 * @param limit - Optional limit on the number of results returned (defaults to 20).
 */
export const getSearchTrends = async (
  limit?: number
): Promise<ApiResponse<SearchTrendItem[]>> => {
  try {
    const response = await adminClient.get<ApiResponse<SearchTrendItem[]>>(
      "/analytics/search-trends",
      {
        params: limit !== undefined ? { limit } : undefined,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
