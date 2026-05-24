"use client";

import React, { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  Eye,
  FileText,
  Layers,
  TrendingUp,
  Search,
  RefreshCw,
  ArrowRight,
  Sparkles,
  SearchIcon
} from 'lucide-react';
import Link from 'next/link';

export function AnalyticsDashboard() {
  const { overview, isLoading, error, loadOverview } = useAnalytics();
  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleRefresh = () => {
    loadOverview();
  };

  // 1. Loading State Screen
  if (isLoading && !overview) {
    return (
      <div className="space-y-6 animate-pulse select-none">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-surface-container rounded-lg w-48" />
          <div className="h-10 bg-surface-container rounded-lg w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-surface-container-low rounded-2xl border border-outline-variant/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-surface-container-low rounded-2xl border border-outline-variant/30" />
          <div className="h-96 bg-surface-container-low rounded-2xl border border-outline-variant/30" />
        </div>
      </div>
    );
  }

  // 2. Error Fallback State
  if (error) {
    return (
      <div className="p-8 bg-error/5 border border-error/20 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-on-surface text-base">Failed to fetch platform metrics</h4>
          <p className="text-xs text-on-surface-variant mt-1 max-w-md">{error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-on-primary rounded-xl font-bold transition-all hover:bg-primary/95 active:scale-98 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const counts = overview?.counts || { totalBlogs: 0, publishedBlogs: 0, totalViews: 0 };
  const topBlogs = overview?.topBlogs || [];
  const trendingTags = overview?.trendingTags || [];
  const recentSearches = overview?.recentSearches || [];

  return (
    <div className="space-y-8 select-none">

      {/* Title Header with Refresh Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h3 className="font-extrabold text-xl text-on-surface tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>Platform Overview</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time content diagnostics, taxonomy indexing, and query trends.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container-low hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface-variant transition-all active:scale-98 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh Stats'}</span>
        </button>
      </div>

      {/* Primary KPI Macro Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Total Views */}
        <div className="relative overflow-hidden p-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex items-center justify-between shadow-sm group hover:border-primary/30 transition-all hover:shadow-md">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
          <div className="space-y-2 z-10">
            <p className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Total Page Views</p>
            <h4 className="font-extrabold text-3xl text-on-surface tracking-tighter">
              {Number(counts.totalViews).toLocaleString()}
            </h4>
            <p className="text-[10px] text-primary font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Lifetime visitor queries</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl z-10 shadow-inner group-hover:scale-105 transition-transform">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Published Articles */}
        <div className="relative overflow-hidden p-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex items-center justify-between shadow-sm group hover:border-primary/30 transition-all hover:shadow-md">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-colors" />
          <div className="space-y-2 z-10">
            <p className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Published Articles</p>
            <h4 className="font-extrabold text-3xl text-on-surface tracking-tighter">
              {counts.publishedBlogs}
            </h4>
            <p className="text-[10px] text-tertiary font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live indexed on search index</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-tertiary/10 text-tertiary flex items-center justify-center rounded-xl z-10 shadow-inner group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total Articles */}
        <div className="relative overflow-hidden p-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex items-center justify-between shadow-sm group hover:border-primary/30 transition-all hover:shadow-md">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-colors" />
          <div className="space-y-2 z-10">
            <p className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Total Draft & Posts</p>
            <h4 className="font-extrabold text-3xl text-on-surface tracking-tighter">
              {counts.totalBlogs}
            </h4>
            <p className="text-[10px] text-secondary font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Aggregated database count</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-secondary/10 text-secondary flex items-center justify-center rounded-xl z-10 shadow-inner group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Top Blogs) + Right Column (Tags & Searches) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Top Performing Blogs Table (Col span 2) */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-sm text-on-surface tracking-tight">Top Performing Content</h4>
              <p className="text-[10px] text-on-surface-variant">Ranked by overall audience page views.</p>
            </div>
            <Link
              href={"/admin/blogs" as any}
              className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
            >
              <span>Manage Content</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {topBlogs.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant/70 text-xs">
                No telemetry recorded yet. Views accumulate dynamically.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20">
                    <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Blog Article Title</th>
                    <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                    <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Traffic Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {topBlogs.map((analytics: any) => {
                    const blog = analytics.Blog || analytics.blog;
                    return (
                      <tr key={analytics.id} className="hover:bg-surface-container-low/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="max-w-[260px] sm:max-w-[400px]">
                            <p className="font-bold text-xs text-on-surface truncate">
                              {blog?.title || 'Untitled Post'}
                            </p>
                            <p className="text-[10px] text-on-surface-variant/80 truncate mt-0.5 font-mono">
                              /{blog?.slug || ''}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold capitalize select-none ${blog?.status === 'published'
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-on-surface-variant/10 text-on-surface-variant border border-outline-variant/20'
                            }`}>
                            {blog?.status || 'draft'}
                          </span>
                        </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-xs text-on-surface">
                        {Number(analytics.totalViews).toLocaleString()}
                      </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Popular Tags & Search Intent */}
        <div className="space-y-6 flex flex-col">

          {/* Trending Taxonomies Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm p-5 space-y-4">
            <div>
              <h4 className="font-extrabold text-sm text-on-surface tracking-tight">Trending Taxonomies</h4>
              <p className="text-[10px] text-on-surface-variant">Top-traffic tag terms grouped by post views.</p>
            </div>

            {trendingTags.length === 0 ? (
              <div className="text-center py-4 text-on-surface-variant/70 text-xs">
                No tags tracked. Write posts and associate tag labels.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {trendingTags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-xl text-xs font-bold text-on-surface-variant border border-outline-variant/20 transition-all hover:border-primary/40 hover:text-on-surface"
                  >
                    <span>#{tag.name}</span>
                    <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-1 rounded">
                      {Number(tag.totalViews).toLocaleString()}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* User Search Query Intent Feed */}
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm p-5 flex flex-col flex-1 space-y-4 max-h-[300px] lg:max-h-[360px] overflow-hidden">
            <div>
              <h4 className="font-extrabold text-sm text-on-surface tracking-tight flex items-center gap-1.5">
                <Search className="w-4 h-4 text-primary" />
                <span>Audience Intent Feed</span>
              </h4>
              <p className="text-[10px] text-on-surface-variant">Live feed of keywords typed by visitors.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {recentSearches.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant/70 text-xs">
                  No public search terms logged yet.
                </div>
              ) : (
                recentSearches.map((search: any) => (
                  <div
                    key={search.id}
                    className="flex justify-between items-center p-2.5 bg-surface-container-low/50 hover:bg-surface-container rounded-xl border border-outline-variant/15 transition-all"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <SearchIcon className="w-3 h-3 text-outline shrink-0" />
                      <p className="font-bold text-xs text-on-surface truncate select-text">
                        {search.query}
                      </p>
                    </div>
                    <span className="text-[9px] text-on-surface-variant shrink-0 font-mono">
                      {new Date(search.searchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
