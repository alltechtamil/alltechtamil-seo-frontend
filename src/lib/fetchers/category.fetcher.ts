import { cache } from "react";
import {
  getPublicCategories as apiGetPublicCategories,
  getPublicCategory as apiGetPublicCategory,
} from "../api/public/categories.api";
import { ApiResponse } from "../../types/api.types";
import { Category } from "../../types/category.types";

/**
 * Server-side deduplicated retrieval of all active categories.
 * Deduplicates category queries within the same server request/render tree pass.
 */
export const getPublicCategories = cache(
  async (): Promise<ApiResponse<Category[]>> => {
    try {
      return await apiGetPublicCategories();
    } catch (error) {
      throw error;
    }
  }
);

/**
 * Server-side deduplicated retrieval of a single category taxonomy by slug.
 * Essential when resolving category details during generateMetadata and the page body render block.
 */
export const getPublicCategory = cache(
  async (slug: string): Promise<ApiResponse<Category>> => {
    try {
      return await apiGetPublicCategory(slug);
    } catch (error) {
      throw error;
    }
  }
);
