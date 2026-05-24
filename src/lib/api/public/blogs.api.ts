import { publicClient } from "../publicClient";
import { ApiResponse, PaginatedResponse } from "../../../types/api.types";
import { Blog, BlogListItem, BlogFilterParams } from "../../../types/blog.types";

/**
 * Fetch a paginated feed of published blog posts.
 */
export const getPublicBlogs = async (
  params?: BlogFilterParams
): Promise<PaginatedResponse<BlogListItem>> => {
  try {
    const response = await publicClient.get<PaginatedResponse<BlogListItem>>(
      "/blogs",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch full article details for a single published blog post by its unique URL slug.
 */
export const getPublicBlogBySlug = async (
  slug: string
): Promise<ApiResponse<Blog>> => {
  try {
    const response = await publicClient.get<ApiResponse<Blog>>(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search all published blog post titles/excerpts.
 * @param query - The search query term.
 * @param page - Optional pagination page number.
 * @param limit - Optional pagination page limit.
 */
export const searchBlogs = async (
  query: string,
  page?: number,
  limit?: number
): Promise<PaginatedResponse<BlogListItem>> => {
  try {
    const response = await publicClient.get<PaginatedResponse<BlogListItem>>(
      "/search",
      {
        params: {
          q: query,
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all published blogs associated with a given category slug.
 */
export const getBlogsByCategorySlug = async (
  slug: string,
  page?: number,
  limit?: number
): Promise<PaginatedResponse<BlogListItem>> => {
  try {
    const response = await publicClient.get<PaginatedResponse<BlogListItem>>(
      `/search/category/${slug}`,
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch all published blogs associated with a given tag slug.
 */
export const getBlogsByTagSlug = async (
  slug: string,
  page?: number,
  limit?: number
): Promise<PaginatedResponse<BlogListItem>> => {
  try {
    const response = await publicClient.get<PaginatedResponse<BlogListItem>>(
      `/search/tag/${slug}`,
      {
        params: {
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
