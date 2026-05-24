"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Edit2, 
  Trash2, 
  Eye, 
  Sparkles, 
  Calendar, 
  User, 
  Layers,
  FileText,
  Globe,
  Bookmark
} from 'lucide-react';
import { BlogListItem, BlogStatus } from '@/types/blog.types';

interface BlogTableProps {
  blogs: BlogListItem[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: BlogStatus) => void;
  isLoading?: boolean;
}

export function BlogTable({ blogs, onDelete, onToggleStatus, isLoading = false }: BlogTableProps) {
  
  // Helper: Format raw DB ISO dates into clean readable dates
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm divide-y divide-outline-variant/20 animate-pulse">
        <div className="h-12 bg-surface-container-low" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-6 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-container rounded w-1/3" />
              <div className="h-3 bg-surface-container rounded w-1/4" />
            </div>
            <div className="h-6 bg-surface-container rounded w-16" />
            <div className="h-8 bg-surface-container rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/50">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-on-surface tracking-tight">No articles found</h4>
          <p className="text-xs text-on-surface-variant max-w-sm mt-1">
            Write your first technical blog, categorize tags, and publish SEO content.
          </p>
        </div>
        <Link
          href={"/admin/blogs/new" as any}
          className="flex items-center gap-2 px-4 py-2 text-xs bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl transition-all shadow-sm active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Write New Article</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/20">
              <th className="py-3.5 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Article Info</th>
              <th className="py-3.5 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Category</th>
              <th className="py-3.5 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Tags</th>
              <th className="py-3.5 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Status</th>
              <th className="py-3.5 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Created</th>
              <th className="py-3.5 px-5 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {blogs.map((blog) => {
              // Gracefully handle both capitalized and camelCased relationships
              const category = blog.Category || blog.category;
              const tags = blog.Tags || blog.tags || [];

              return (
                <tr key={blog.id} className="hover:bg-surface-container-low/20 transition-colors">
                  
                  {/* Column 1: Title, Slug & Featured Badge */}
                  <td className="py-4 px-5 max-w-[280px] sm:max-w-[340px]">
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {blog.isFeatured && (
                          <span 
                            className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/25 rounded-md text-[8px] font-bold"
                            title="Featured Post"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>FEATURED</span>
                          </span>
                        )}
                        <span className="font-bold text-xs text-on-surface truncate tracking-tight hover:text-primary transition-colors">
                          {blog.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/80 font-mono truncate">
                        /{blog.slug}
                      </span>
                    </div>
                  </td>

                  {/* Column 2: Category Capsule */}
                  <td className="py-4 px-5">
                    {category ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-secondary/5 text-secondary border border-secondary/15 rounded-full text-[10px] font-bold">
                        <Layers className="w-3 h-3" />
                        <span>{category.name}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/50 italic">Uncategorized</span>
                    )}
                  </td>

                  {/* Column 3: Tags Cluster */}
                  <td className="py-4 px-5 max-w-[180px]">
                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 2).map((t: any) => {
                          const tagName = t.name || t;
                          const tagKey = t.id || tagName;
                          return (
                            <span 
                              key={tagKey} 
                              className="px-1.5 py-0.5 bg-surface-container-high rounded text-[9px] font-bold text-on-surface-variant border border-outline-variant/30"
                            >
                              #{tagName}
                            </span>
                          );
                        })}
                        {tags.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-surface-container rounded text-[9px] font-bold text-on-surface-variant/70 border border-outline-variant/10">
                            +{tags.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/50 italic">No tags</span>
                    )}
                  </td>

                  {/* Column 4: Status Live Toggle */}
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() => onToggleStatus(blog.id, blog.status)}
                      title={`Click to toggle to ${blog.status === 'published' ? 'draft' : 'published'}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold capitalize select-none cursor-pointer transition-all active:scale-95 border hover:shadow-sm ${
                        blog.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        blog.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span>{blog.status}</span>
                    </button>
                  </td>

                  {/* Column 5: Created Date */}
                  <td className="py-4 px-5 font-mono text-[10px] text-on-surface-variant/90">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-on-surface-variant/60" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </td>

                  {/* Column 6: Action Triggers */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Live Preview */}
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Live Site Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </a>

                      {/* Edit Article */}
                      <Link 
                        href={`/admin/blogs/${blog.id}` as any}
                        className="p-1.5 text-on-surface-variant hover:text-primary bg-surface-container-low hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit Article Content"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Delete Trigger */}
                      <button
                        onClick={() => onDelete(blog.id)}
                        className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all"
                        title="Permanently Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
