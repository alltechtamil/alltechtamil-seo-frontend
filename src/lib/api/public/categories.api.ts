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
 */
export const getPublicCategory = async (
  slug: string
): Promise<ApiResponse<Category>> => {
  try {
    const response = await publicClient.get<ApiResponse<Category>>(
      `/categories/${slug}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
