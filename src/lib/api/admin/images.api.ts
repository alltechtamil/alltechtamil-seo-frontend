import { adminClient } from "../adminClient";
import { ApiResponse, PaginatedResponse } from "../../../types/api.types";
import { BlogImage, ImageFilterParams } from "../../../types/image.types";

/**
 * Fetch a paginated list of all uploaded images.
 */
export const getAdminImages = async (
  params?: ImageFilterParams
): Promise<PaginatedResponse<BlogImage>> => {
  try {
    const response = await adminClient.get<PaginatedResponse<BlogImage>>(
      "/images",
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
 * Retrieve all images specifically linked to a given blog.
 */
export const getAdminImagesByBlogId = async (
  blogId: string
): Promise<ApiResponse<BlogImage[]>> => {
  try {
    const response = await adminClient.get<ApiResponse<BlogImage[]>>(
      `/images/blog/${blogId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload a single image file, converting it to optimized WebP on the backend.
 * @param file - The raw Image file to upload.
 * @param blogId - Optional UUID linking this image to a specific blog.
 * @param altText - Optional accessibility alt text description.
 */
export const uploadImage = async (
  file: File | Blob,
  blogId?: string | null,
  altText?: string | null
): Promise<ApiResponse<BlogImage>> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    if (blogId) formData.append("blog_id", blogId);
    if (altText) formData.append("alt_text", altText);

    const response = await adminClient.post<ApiResponse<BlogImage>>(
      "/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Permanently delete an image DB record by UUID. (Superadmin exclusive)
 */
export const deleteImage = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.delete<ApiResponse<null>>(
      `/images/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
