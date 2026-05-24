import { adminClient } from "../adminClient";
import { ApiResponse, PaginatedResponse } from "../../../types/api.types";
import {
  Blog,
  BlogListItem,
  BlogFilterParams,
  CreateBlogPayload,
  UpdateBlogPayload,
  BlogStatus,
} from "../../../types/blog.types";

/**
 * Fetch a paginated lists of blog posts with optional filters.
 * Returns a detailed paginated response metadata containing total, pages, and items.
 */
export const getAdminBlogs = async (
  params?: BlogFilterParams
): Promise<PaginatedResponse<BlogListItem>> => {
  try {
    const response = await adminClient.get<PaginatedResponse<BlogListItem>>(
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
 * Fetch a single blog post details by its unique UUID.
 */
export const getAdminBlog = async (id: string): Promise<ApiResponse<Blog>> => {
  try {
    const response = await adminClient.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a single blog post details by its URL slug.
 */
export const getAdminBlogBySlug = async (
  slug: string
): Promise<ApiResponse<Blog>> => {
  try {
    const response = await adminClient.get<ApiResponse<Blog>>(
      `/blogs/slug/${slug}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new blog post.
 */
export const createBlog = async (
  payload: CreateBlogPayload
): Promise<ApiResponse<Blog>> => {
  try {
    const response = await adminClient.post<ApiResponse<Blog>>(
      "/blogs",
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing blog post by its unique UUID.
 */
export const updateBlog = async (
  id: string,
  payload: UpdateBlogPayload
): Promise<ApiResponse<Blog>> => {
  try {
    const response = await adminClient.put<ApiResponse<Blog>>(
      `/blogs/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Permanently delete a blog post by its UUID. (Superadmin exclusive)
 */
export const deleteBlog = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.delete<ApiResponse<null>>(
      `/blogs/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fast-path update to immediately toggle the editorial status of a post.
 */
export const updateBlogStatus = async (
  id: string,
  status: BlogStatus,
  publishedAt?: string | null
): Promise<ApiResponse<Blog>> => {
  try {
    const response = await adminClient.patch<ApiResponse<Blog>>(
      `/blogs/${id}/status`,
      {
        status,
        published_at: publishedAt,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
