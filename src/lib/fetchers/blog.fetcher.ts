import { cache } from "react";
import {
  getPublicBlogs as apiGetPublicBlogs,
  getPublicBlogBySlug as apiGetPublicBlogBySlug,
} from "../api/public/blogs.api";
import { BlogFilterParams, BlogListItem, Blog } from "../../types/blog.types";
import { ApiResponse, PaginatedResponse } from "../../types/api.types";

/**
 * Server-side deduplicated retrieval of public published blog posts feed.
 * Deduplicates multiple fetch calls targeting the same list query parameters within a single render request.
 */
export const getPublicBlogs = cache(
  async (
    params?: BlogFilterParams
  ): Promise<PaginatedResponse<BlogListItem>> => {
    try {
      return await apiGetPublicBlogs(params);
    } catch (error) {
      throw error;
    }
  }
);

/**
 * Server-side deduplicated retrieval of a single published blog article details by slug.
 * Highly useful when both generateMetadata() and the page component fetch the same slug during server rendering.
 */
export const getPublicBlogBySlug = cache(
  async (slug: string): Promise<ApiResponse<Blog>> => {
    try {
      return await apiGetPublicBlogBySlug(slug);
    } catch (error) {
      throw error;
    }
  }
);

/**
 * Server-side deduplicated retrieval of related blog posts (under the same category, excluding current post).
 * @param categoryId - UUID of the active category to filter by.
 * @param currentBlogId - UUID of the current blog to exclude from the recommendation.
 * @param limit - Maximum number of related posts to return (defaults to 3).
 */
export const getRelatedBlogs = cache(
  async (
    categoryId: string,
    currentBlogId: string,
    limit: number = 3
  ): Promise<BlogListItem[]> => {
    try {
      // Fetch slightly more to ensure we filter out the current post and still meet the limit count
      const response = await apiGetPublicBlogs({
        categoryId,
        limit: 10,
      });

      const filtered = (response.data || []).filter(
        (blog) => blog.id !== currentBlogId
      );

      return filtered.slice(0, limit);
    } catch (error) {
      // Return an empty array gracefully to prevent crashing server-side rendering
      console.error(
        `Failed to fetch related blogs for category ID ${categoryId}:`,
        error
      );
      return [];
    }
  }
);
