"use client";

import React, { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import {
  LineChart,
  Search,
  Hourglass,
  Percent,
  Eye,
  Users,
  RefreshCw,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function PerformanceAnalyticsPage() {
  const {
    overview,
    searchTrends,
    isLoading,
    error,
    loadOverview,
    loadSearchTrends
  } = useAnalytics();

  useEffect(() => {
    loadOverview();
    loadSearchTrends(20);
  }, [loadOverview, loadSearchTrends]);

  const handleRefresh = () => {
    loadOverview();
    loadSearchTrends(20);
  };

  // Helper: Format seconds to readable MM:SS
  const formatRetentionTime = (seconds: number) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // Helper: Calculate bounce rate cleanly
  const calculateBounceRate = (bounceCount: string | number, totalViews: string | number) => {
    const bounces = Number(bounceCount) || 0;
    const views = Number(totalViews) || 0;
    if (views === 0) return '0%';
    const rate = (bounces / views) * 100;
    return `${rate.toFixed(1)}%`;
  };

  if (isLoading && !overview) {
    return (
      <div className="space-y-6 animate-pulse select-none max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-surface-container rounded-lg w-64" />
          <div className="h-10 bg-surface-container rounded-lg w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-surface-container-low rounded-2xl border border-outline-variant/30" />
          ))}
        </div>
        <div className="h-96 bg-surface-container-low rounded-2xl border border-outline-variant/30" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-error/5 border border-error/20 rounded-2xl text-center flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
          <LineChart className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-on-surface text-base">Failed to load telemetry analytics</h4>
          <p className="text-xs text-on-surface-variant mt-1 max-w-md">{error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-on-primary rounded-xl font-bold transition-all hover:bg-primary/95 active:scale-98"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const counts = overview?.counts || { totalBlogs: 0, publishedBlogs: 0, totalViews: 0 };
  const topBlogs = overview?.topBlogs || [];

  // Calculate average bounce rate and engagement times across all active blogs
  const totalViewsNum = Number(counts.totalViews) || 0;
  const aggregateBounces = topBlogs.reduce((acc, curr) => acc + (Number(curr.bounceCount) || 0), 0);
  const avgBounceRate = totalViewsNum > 0 ? ((aggregateBounces / totalViewsNum) * 100).toFixed(1) : '0';

  const avgRetention = topBlogs.length > 0
    ? Math.round(topBlogs.reduce((acc, curr) => acc + (Number(curr.avgReadTimeSec) || 0), 0) / topBlogs.length)
    : 0;

  return (
    <div className="space-y-8 select-none max-w-7xl mx-auto">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h3 className="font-extrabold text-xl text-on-surface tracking-tight flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" />
            <span>Telemetry & Performance Diagnostics</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Granular analysis of visitor retention metrics, query volume logs, and bounce triggers.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container-low hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface-variant transition-all active:scale-98"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Grid: 4 Small KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* KPI 1: Gross Views */}
        <div className="p-5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Views</span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3">
            <h4 className="font-extrabold text-2xl text-on-surface tracking-tight">
              {totalViewsNum.toLocaleString()}
            </h4>
            <p className="text-[10px] text-primary font-bold mt-1">Total page view logs</p>
          </div>
        </div>

        {/* KPI 2: Avg. Bounce Rate */}
        <div className="p-5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[10px] font-bold uppercase tracking-wider">Platform Bounce Rate</span>
            <Percent className="w-4 h-4 text-tertiary" />
          </div>
          <div className="mt-3">
            <h4 className="font-extrabold text-2xl text-on-surface tracking-tight">
              {avgBounceRate}%
            </h4>
            <p className="text-[10px] text-tertiary font-bold mt-1">Overall bounce ratio</p>
          </div>
        </div>

        {/* KPI 3: Average Retention Time */}
        <div className="p-5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg. Retention Time</span>
            <Hourglass className="w-4 h-4 text-secondary" />
          </div>
          <div className="mt-3">
            <h4 className="font-extrabold text-2xl text-on-surface tracking-tight">
              {formatRetentionTime(avgRetention)}
            </h4>
            <p className="text-[10px] text-secondary font-bold mt-1">Active reading durations</p>
          </div>
        </div>

        {/* KPI 4: Audience Reach */}
        <div className="p-5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[10px] font-bold uppercase tracking-wider">Unique Audience</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3">
            <h4 className="font-extrabold text-2xl text-on-surface tracking-tight">
              {topBlogs.reduce((acc, curr) => acc + (Number(curr.uniqueVisitors) || 0), 0).toLocaleString()}
            </h4>
            <p className="text-[10px] text-primary font-bold mt-1">Sum of unique visitors</p>
          </div>
        </div>

      </div>

      {/* Main Table: Detailed Content Retention Spreadsheet */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-sm text-on-surface tracking-tight flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              <span>Granular Post Telemetry Diagnostics</span>
            </h4>
            <p className="text-[10px] text-on-surface-variant">Real-time bounce ratios, view logs, and retention time per article.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {topBlogs.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant/70 text-xs">
              No content logs are recorded yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Article Title</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Page Views</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Unique Visitors</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Bounce Rate</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Avg Retention</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Last View Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {topBlogs.map((analytics: any) => {
                  const blog = analytics.Blog || analytics.blog;
                  return (
                    <tr key={analytics.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="py-3.5 px-4 max-w-[280px] sm:max-w-[400px]">
                        <p className="font-bold text-xs text-on-surface truncate">
                          {blog?.title || 'Untitled Post'}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/80 truncate mt-0.5 font-mono">
                          /{blog?.slug || ''}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-xs text-on-surface">
                        {Number(analytics.totalViews).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-xs text-on-surface-variant">
                        {Number(analytics.uniqueVisitors).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-xs text-tertiary">
                        {calculateBounceRate(analytics.bounceCount, analytics.totalViews)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-xs text-secondary">
                        {formatRetentionTime(analytics.avgReadTimeSec)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[10px] text-on-surface-variant">
                        {analytics.lastViewedAt
                          ? new Date(analytics.lastViewedAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Secondary Table: User Intent Keyword Analytics */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-outline-variant/30">
          <h4 className="font-extrabold text-sm text-on-surface tracking-tight flex items-center gap-1.5">
            <Search className="w-4 h-4 text-primary" />
            <span>Search Intent & SEO Demand Trends</span>
          </h4>
          <p className="text-[10px] text-on-surface-variant">Macro log of keywords typed by site visitors and their query volume count.</p>
        </div>

        <div className="overflow-x-auto">
          {!searchTrends || searchTrends.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant/70 text-xs">
              No intent keywords captured yet. Public search operations log queries dynamically.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-3 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Search Keyword / Query</th>
                  <th className="py-3 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Occurrence Hits</th>
                  <th className="py-3 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Last Searched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {searchTrends.map((trend: any, idx: number) => (
                  <tr key={idx} className="hover:bg-surface-container-low/20 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-outline w-5 text-center">{idx + 1}.</span>
                        <p className="font-bold text-xs text-on-surface select-text">{trend.query}</p>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary">
                        <TrendingUp className="w-3 h-3" />
                        <span>{Number(trend.occurrences).toLocaleString()} hits</span>
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right font-mono text-[10px] text-on-surface-variant">
                      {new Date(trend.lastSearched).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
