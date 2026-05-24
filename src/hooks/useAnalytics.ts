"use client";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchOverview,
  fetchBlogStats,
  fetchSearchTrends,
  trackView,
  clearBlogStats,
} from "../store/slices/analyticsSlice";
import { useCallback } from "react";

/**
 * Premium hook for accessing and triggering administrative and visitor analytics telemetry.
 */
export function useAnalytics() {
  const dispatch = useAppDispatch();
  const { overview, blogStats, searchTrends, isLoading, error } = useAppSelector(
    (state) => state.analytics
  );

  const loadOverview = useCallback(async () => {
    return dispatch(fetchOverview()).unwrap();
  }, [dispatch]);

  const loadBlogStats = useCallback(async (blogId: string) => {
    return dispatch(fetchBlogStats(blogId)).unwrap();
  }, [dispatch]);

  const loadSearchTrends = useCallback(async (limit?: number) => {
    return dispatch(fetchSearchTrends(limit)).unwrap();
  }, [dispatch]);

  const recordView = useCallback(async (payload: { blogId: string; readTimeSec?: number; isBounce?: boolean }) => {
    return dispatch(trackView(payload)).unwrap();
  }, [dispatch]);

  const resetBlogStats = useCallback(() => {
    dispatch(clearBlogStats());
  }, [dispatch]);

  return {
    overview,
    blogStats,
    searchTrends,
    isLoading,
    error,
    loadOverview,
    loadBlogStats,
    loadSearchTrends,
    recordView,
    resetBlogStats,
  };
}
