import { publicClient } from "../publicClient";
import { ApiResponse } from "../../../types/api.types";
import { Tag } from "../../../types/tag.types";

/**
 * Fetch all tags configured in the platform.
 * @param popular - Optional flag to retrieve only highly used tags.
 */
export const getPublicTags = async (
  popular?: boolean
): Promise<ApiResponse<Tag[]>> => {
  try {
    const response = await publicClient.get<ApiResponse<Tag[]>>("/tags", {
      params: popular !== undefined ? { popular } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve details for a single tag keyword by its URL slug.
 * Returns null data on 404 instead of throwing, so the page
 * component can call notFound() cleanly without corrupting RSC streaming.
 */
export const getPublicTag = async (slug: string): Promise<ApiResponse<Tag | null>> => {
  try {
    const response = await publicClient.get<ApiResponse<Tag>>(`/tags/${slug}`);
    return response.data;
  } catch (error: any) {
    // Treat 404 as "not found" — return null so the page calls notFound() gracefully
    if (error?.status_code === 404) {
      return { success: false, data: null, status_code: 404, message: 'Not found', errors: null, correlation_id: '', timestamp: new Date().toISOString() };
    }
    throw error;
  }
};
