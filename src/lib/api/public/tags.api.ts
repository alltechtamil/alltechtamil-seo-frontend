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
 */
export const getPublicTag = async (slug: string): Promise<ApiResponse<Tag>> => {
  try {
    const response = await publicClient.get<ApiResponse<Tag>>(`/tags/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
