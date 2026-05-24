import { adminClient } from "../adminClient";
import { ApiResponse } from "../../../types/api.types";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../../../types/category.types";

/**
 * Fetch list of categories for administration.
 * @param includeInactive - Optional flag to retrieve inactive categories.
 */
export const getAdminCategories = async (
  includeInactive?: boolean
): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await adminClient.get<ApiResponse<Category[]>>(
      "/categories",
      {
        params: includeInactive !== undefined ? { includeInactive } : undefined,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve details for a single category taxonomy by its URL slug.
 */
export const getAdminCategory = async (
  slug: string
): Promise<ApiResponse<Category>> => {
  try {
    const response = await adminClient.get<ApiResponse<Category>>(
      `/categories/${slug}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new category taxonomy.
 */
export const createCategory = async (
  payload: CreateCategoryPayload
): Promise<ApiResponse<Category>> => {
  try {
    const response = await adminClient.post<ApiResponse<Category>>(
      "/categories",
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing category taxonomy by its unique UUID.
 */
export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload
): Promise<ApiResponse<Category>> => {
  try {
    const response = await adminClient.put<ApiResponse<Category>>(
      `/categories/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Permanently delete a category by its UUID. (Superadmin exclusive)
 */
export const deleteCategory = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.delete<ApiResponse<null>>(
      `/categories/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
