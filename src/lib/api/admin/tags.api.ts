import { adminClient } from "../adminClient";
import { ApiResponse } from "../../../types/api.types";
import {
  Tag,
  CreateTagPayload,
  UpdateTagPayload,
} from "../../../types/tag.types";

/**
 * Fetch list of tags for administration.
 * @param popular - Optional flag to retrieve only highly used tags.
 */
export const getAdminTags = async (
  popular?: boolean
): Promise<ApiResponse<Tag[]>> => {
  try {
    const response = await adminClient.get<ApiResponse<Tag[]>>("/tags", {
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
export const getAdminTag = async (slug: string): Promise<ApiResponse<Tag>> => {
  try {
    const response = await adminClient.get<ApiResponse<Tag>>(`/tags/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new tag keyword manually.
 */
export const createTag = async (
  payload: CreateTagPayload
): Promise<ApiResponse<Tag>> => {
  try {
    const response = await adminClient.post<ApiResponse<Tag>>("/tags", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing tag keyword by its unique UUID.
 */
export const updateTag = async (
  id: string,
  payload: UpdateTagPayload
): Promise<ApiResponse<Tag>> => {
  try {
    const response = await adminClient.put<ApiResponse<Tag>>(
      `/tags/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Permanently delete a tag by its UUID. (Superadmin exclusive)
 */
export const deleteTag = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.delete<ApiResponse<null>>(`/tags/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
