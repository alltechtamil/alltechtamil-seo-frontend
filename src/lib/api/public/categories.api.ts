import { publicClient } from "../publicClient";
import { ApiResponse } from "../../../types/api.types";
import { Category } from "../../../types/category.types";

/**
 * Fetch all active category taxonomies.
 */
export const getPublicCategories = async (): Promise<
  ApiResponse<Category[]>
> => {
  try {
    const response = await publicClient.get<ApiResponse<Category[]>>(
      "/categories"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch single active category details by its unique URL slug.
 * Returns null data on 404 instead of throwing, so the page
 * component can call notFound() cleanly without corrupting RSC streaming.
 */
export const getPublicCategory = async (
  slug: string
): Promise<ApiResponse<Category | null>> => {
  try {
    const response = await publicClient.get<ApiResponse<Category>>(
      `/categories/${slug}`
    );
    return response.data;
  } catch (error: any) {
    // Treat 404 as "not found" — return null so the page calls notFound() gracefully
    if (error?.status_code === 404) {
      return { success: false, data: null, status_code: 404, message: 'Not found', errors: null, correlation_id: '', timestamp: new Date().toISOString() };
    }
    throw error;
  }
};
