import { cache } from "react";
import {
  getPublicTags as apiGetPublicTags,
  getPublicTag as apiGetPublicTag,
} from "../api/public/tags.api";
import { ApiResponse } from "../../types/api.types";
import { Tag } from "../../types/tag.types";

/**
 * Server-side deduplicated retrieval of tags.
 * @param popular - Optional flag to retrieve only highly used tags.
 * Deduplicates tag queries within the same server request/render tree pass.
 */
export const getPublicTags = cache(
  async (popular?: boolean): Promise<ApiResponse<Tag[]>> => {
    try {
      return await apiGetPublicTags(popular);
    } catch (error) {
      throw error;
    }
  }
);

/**
 * Server-side deduplicated retrieval of a single tag by slug.
 * Essential when resolving tag details during generateMetadata and the page body render block.
 */
export const getPublicTag = cache(
  async (slug: string): Promise<ApiResponse<Tag>> => {
    try {
      return await apiGetPublicTag(slug);
    } catch (error) {
      throw error;
    }
  }
);
