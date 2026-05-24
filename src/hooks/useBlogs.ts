"use client";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAdminBlogs,
  fetchAdminBlogById,
  fetchAdminBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  fetchPublicBlogs,
  fetchPublicBlogBySlug,
  clearCurrentBlog,
  clearError,
} from "../store/slices/blogsSlice";
import { useCallback } from "react";
import { BlogFilterParams, CreateBlogPayload, UpdateBlogPayload, BlogStatus } from "../types/blog.types";

/**
 * Premium custom React hook for managing administrative and public blog actions.
 * Simplifies dispatch operations, handles status updates, and handles metadata pagination.
 */
export function useBlogs() {
  const dispatch = useAppDispatch();
  const {
    adminBlogs,
    publicBlogs,
    currentBlog,
    adminMeta,
    publicMeta,
    isLoading,
    error,
  } = useAppSelector((state) => state.blogs);

  const loadAdminBlogs = useCallback(async (params?: BlogFilterParams) => {
    return dispatch(fetchAdminBlogs(params)).unwrap();
  }, [dispatch]);

  const loadAdminBlogById = useCallback(async (id: string) => {
    return dispatch(fetchAdminBlogById(id)).unwrap();
  }, [dispatch]);

  const loadAdminBlogBySlug = useCallback(async (slug: string) => {
    return dispatch(fetchAdminBlogBySlug(slug)).unwrap();
  }, [dispatch]);

  const createNewBlog = useCallback(async (payload: CreateBlogPayload) => {
    return dispatch(createBlog(payload)).unwrap();
  }, [dispatch]);

  const updateExistingBlog = useCallback(async (id: string, payload: UpdateBlogPayload) => {
    return dispatch(updateBlog({ id, payload })).unwrap();
  }, [dispatch]);

  const removeBlog = useCallback(async (id: string) => {
    return dispatch(deleteBlog(id)).unwrap();
  }, [dispatch]);

  const toggleBlogStatus = useCallback(async (id: string, status: BlogStatus, publishedAt?: string | null) => {
    return dispatch(updateBlogStatus({ id, status, publishedAt })).unwrap();
  }, [dispatch]);

  const loadPublicBlogs = useCallback(async (params?: BlogFilterParams) => {
    return dispatch(fetchPublicBlogs(params)).unwrap();
  }, [dispatch]);

  const loadPublicBlogBySlug = useCallback(async (slug: string) => {
    return dispatch(fetchPublicBlogBySlug(slug)).unwrap();
  }, [dispatch]);

  const resetCurrentBlog = useCallback(() => {
    dispatch(clearCurrentBlog());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Selectors
    adminBlogs,
    publicBlogs,
    currentBlog,
    adminMeta: adminMeta as { totalCount: number; currentPage: number; perPage: number; totalPages: number } | null,
    publicMeta: publicMeta as { totalCount: number; currentPage: number; perPage: number; totalPages: number } | null,
    isLoading,
    error,

    // Dispatch Actions
    loadAdminBlogs,
    loadAdminBlogById,
    loadAdminBlogBySlug,
    createNewBlog,
    updateExistingBlog,
    removeBlog,
    toggleBlogStatus,
    loadPublicBlogs,
    loadPublicBlogBySlug,
    resetCurrentBlog,
    resetError,
  };
}
