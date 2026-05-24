import { Blog } from "./blog.types";

/**
 * Platform metrics and visitor performance telemetry associated with a single Blog.
 */
export interface BlogAnalytics {
  id: string;
  blogId: string;
  totalViews: string; // string to prevent JS BIGINT precision loss
  uniqueVisitors: string; // string to prevent JS BIGINT precision loss
  avgReadTimeSec: number;
  bounceCount: string; // string to prevent JS BIGINT precision loss
  lastViewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrendingTag {
  id: string;
  name: string;
  slug: string;
  totalViews: string;
}

export interface SearchLogItem {
  id: string;
  query: string;
  searchedAt: string;
}

export interface AnalyticsOverview {
  counts: {
    totalBlogs: number;
    publishedBlogs: number;
    totalViews: string | number;
  };
  topBlogs: (BlogAnalytics & { 
    blog?: Pick<Blog, "id" | "title" | "slug" | "status">;
    Blog?: Pick<Blog, "id" | "title" | "slug" | "status">;
  })[];
  trendingTags: TrendingTag[];
  recentSearches: SearchLogItem[];
}

export interface SearchTrendItem {
  query: string;
  occurrences: string | number;
  lastSearched: string;
}

