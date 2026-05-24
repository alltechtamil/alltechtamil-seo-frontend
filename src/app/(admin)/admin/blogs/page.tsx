"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminCategories } from '@/store/slices/categoriesSlice';
import { BlogTable } from '@/components/admin/BlogTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { BlogStatus } from '@/types/blog.types';

export default function AdminBlogsPage() {
  const dispatch = useAppDispatch();
  
  // custom blog hook
  const {
    adminBlogs,
    adminMeta,
    isLoading,
    error,
    loadAdminBlogs,
    toggleBlogStatus,
    removeBlog
  } = useBlogs();

  // category state from store
  const { adminCategories } = useAppSelector((state) => state.categories);

  // local filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  // modal state
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // Fetch blogs wrapper supporting page, limit, status, categoryId
  const fetchBlogsData = useCallback(() => {
    const params: any = {
      page: currentPage,
      limit,
    };
    if (selectedStatus !== 'all') {
      params.status = selectedStatus as BlogStatus;
    }
    if (selectedCategory !== 'all') {
      params.categoryId = selectedCategory;
    }
    loadAdminBlogs(params);
  }, [currentPage, selectedStatus, selectedCategory, loadAdminBlogs]);

  // Fetch blogs on query changes
  useEffect(() => {
    fetchBlogsData();
  }, [fetchBlogsData]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchAdminCategories(true));
  }, [dispatch]);

  // Reset pagination on filter change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchBlogsData();
    dispatch(fetchAdminCategories(true));
  };

  // Status rapid toggle wrapper
  const handleToggleStatus = async (id: string, currentStatus: BlogStatus) => {
    try {
      const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
      await toggleBlogStatus(id, nextStatus, nextStatus === 'published' ? new Date().toISOString() : null);
      fetchBlogsData();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Deletion confirm modal triggers
  const handleDeleteTrigger = (id: string) => {
    setBlogToDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    try {
      await removeBlog(blogToDelete);
      setBlogToDelete(null);
      fetchBlogsData();
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  // Client-side text filter over active paginated blogs
  const filteredBlogs = adminBlogs.filter((blog) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.slug.toLowerCase().includes(query) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(query))
    );
  });

  // Calculate totals for quick overview counts
  const totalCount = adminMeta?.totalCount || 0;
  const totalPages = adminMeta?.totalPages || 1;
  const startEntry = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalCount);

  return (
    <div className="space-y-8 select-none max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h3 className="font-extrabold text-xl text-on-surface tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Articles & Editorial Content</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage your high-performance SEO content, toggle published status, and review category structures.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center justify-center p-2.5 border border-outline-variant bg-surface-container-low hover:bg-surface-container-high rounded-xl text-on-surface-variant transition-all active:scale-98"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href={"/admin/blogs/new" as any}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-xs transition-all shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Posts */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm hover:border-primary/20 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Articles</p>
            <h4 className="font-extrabold text-lg text-on-surface mt-0.5">{totalCount}</h4>
          </div>
        </div>

        {/* Metric 2: Published */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm hover:border-emerald-500/20 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/5 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Published</p>
            <h4 className="font-extrabold text-lg text-on-surface mt-0.5">
              {adminBlogs.filter(b => b.status === 'published').length} on page
            </h4>
          </div>
        </div>

        {/* Metric 3: Categories Loaded */}
        <div className="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm hover:border-secondary/20 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-secondary/5 text-secondary flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Categories</p>
            <h4 className="font-extrabold text-lg text-on-surface mt-0.5">{adminCategories.length}</h4>
          </div>
        </div>

      </div>

      {/* Filtration & Searching Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-2xl shadow-sm">
        
        {/* Query Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Search title, slug, excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary rounded-xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition-all"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant px-3 py-1.5 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-on-surface-variant/60" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs font-bold text-on-surface-variant/90 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {adminCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-on-surface-variant/60" />
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs font-bold text-on-surface-variant/90 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Tabular View */}
      {error ? (
        <div className="p-8 bg-error/5 border border-error/20 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-on-surface text-sm">Error Loading Blogs</h4>
            <p className="text-xs text-on-surface-variant mt-1">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-xs bg-primary text-on-primary font-bold rounded-xl transition-all"
          >
            Retry Fetch
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <BlogTable
            blogs={filteredBlogs}
            onDelete={handleDeleteTrigger}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-2 select-none">
              <span className="text-[11px] text-on-surface-variant/80 font-bold">
                Showing {startEntry} to {endEntry} of {totalCount} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="p-2 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container rounded-xl text-on-surface-variant transition-all disabled:opacity-40 disabled:hover:bg-transparent active:scale-95 cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-on-surface-variant px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/60">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isLoading}
                  className="p-2 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container rounded-xl text-on-surface-variant transition-all disabled:opacity-40 disabled:hover:bg-transparent active:scale-95 cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Interceptor Modal */}
      <ConfirmDialog
        isOpen={blogToDelete !== null}
        title="Delete Blog Post Permanent Confirmation"
        message="Are you absolutely sure you want to permanently delete this technical article? This operations cannot be undone and will immediately wipe all reader telemetry and metadata records."
        confirmText="Permanently Delete"
        cancelText="Cancel Deletion"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBlogToDelete(null)}
        isDestructive={true}
      />

    </div>
  );
}
