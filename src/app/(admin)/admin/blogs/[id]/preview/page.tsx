"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminBlogById, clearCurrentBlog } from '@/store/slices/blogsSlice';
import { Loader2, ArrowLeft, Calendar, User, Hash, AlertCircle } from 'lucide-react';

export default function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentBlog, isLoading, error } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminBlogById(id));
    }
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  if (isLoading && !currentBlog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-on-surface-variant gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm font-bold tracking-wider uppercase">Building Preview Instance...</span>
      </div>
    );
  }

  if (error && !currentBlog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-error gap-3">
        <AlertCircle className="w-10 h-10" />
        <h2 className="text-lg font-bold">Failed to load preview</h2>
        <button 
          onClick={() => router.push('/admin/blogs' as any)}
          className="mt-4 px-4 py-2 bg-surface-container-low text-on-surface border border-outline-variant/50 rounded-xl hover:bg-surface-container-high transition-colors font-bold text-xs"
        >
          Return to Library
        </button>
      </div>
    );
  }

  if (!currentBlog) return null;

  return (
    <div className="max-w-[900px] mx-auto pb-24 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Admin Action Header */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-outline-variant/30">
        <button 
          type="button" 
          onClick={() => router.push(`/admin/blogs/${id}` as any)}
          className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-3 py-1.5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editor</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Live Preview Render
          </span>
        </div>
      </div>

      {/* Simulated Public Layout Wrapper */}
      <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-12 shadow-sm overflow-hidden">
        
        {/* Cover Image Placeholder */}
        {currentBlog.ogImageUrl && (
          <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden mb-10 border border-outline-variant/20 shadow-inner bg-surface-container-low relative">
            {/* Using standard img to avoid Next/Image domain config issues in the sandbox */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentBlog.ogImageUrl} 
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Public Headers */}
        <header className="mb-12">
          {currentBlog.category && (
            <span className="inline-block px-3 py-1 text-xs font-bold text-primary bg-primary/10 rounded-full mb-6">
              {currentBlog.category.name}
            </span>
          )}
          
          <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight leading-tight mb-6">
            {currentBlog.title}
          </h1>

          {currentBlog.excerpt && (
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-6 font-medium">
              {currentBlog.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-xs text-on-surface-variant/80 font-bold tracking-wider pt-6 border-t border-outline-variant/20">
            {currentBlog.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>{currentBlog.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {currentBlog.publishedAt 
                  ? new Date(currentBlog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'Unpublished Draft'}
              </span>
            </div>
            {currentBlog.readTimeMinutes && (
              <div className="flex items-center gap-2">
                <span>{currentBlog.readTimeMinutes} Min Read</span>
              </div>
            )}
          </div>
        </header>

        {/* =======================================================
            CORE RICH TEXT RENDER 
            Tailwind Typography prose handles all raw HTML styling
        ======================================================= */}
        <div 
          className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-on-surface
          prose-p:text-on-surface prose-strong:text-on-surface prose-li:text-on-surface
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-outline-variant/30
          prose-pre:bg-surface-container-low prose-pre:border prose-pre:border-outline-variant/40 prose-pre:text-on-surface
          prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
          prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:text-on-surface-variant"
          dangerouslySetInnerHTML={{ __html: currentBlog.contentHtml }}
        />

        {/* Public Tags Array */}
        {currentBlog.tags && currentBlog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-outline-variant/30 flex flex-wrap gap-2">
            {currentBlog.tags.map(tag => (
              <span key={tag.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low border border-outline-variant/50 rounded-lg text-xs font-bold text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors cursor-default">
                <Hash className="w-3.5 h-3.5" />
                {tag.name}
              </span>
            ))}
          </div>
        )}

      </article>
    </div>
  );
}
