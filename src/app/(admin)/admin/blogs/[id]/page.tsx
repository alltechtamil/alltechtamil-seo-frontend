"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminBlogById, updateBlog, clearCurrentBlog } from '@/store/slices/blogsSlice';
import { setDirty } from '@/store/slices/blogEditorSlice';
import { BlogEditor, BlogFormData } from '@/components/admin/BlogEditor';
import { UpdateBlogPayload } from '@/types/blog.types';
import { Loader2, AlertCircle } from 'lucide-react';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentBlog, isLoading, error } = useAppSelector((state) => state.blogs);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch the active blog data on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchAdminBlogById(id));
    }
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Map frontend camelCase form data to backend snake_case API payload
      const payload: UpdateBlogPayload = {
        title: data.title,
        slug: data.slug || undefined,
        excerpt: data.excerpt || undefined,
        content_html: data.contentHtml,
        category_id: data.categoryId || null,
        tags: data.tags,
        status: data.status,
        is_featured: data.isFeatured,
        published_at: data.publishedAt || null,
        seo_title: data.seoTitle || null,
        seo_description: data.seoDescription || null,
        canonical_url: data.canonicalUrl || null,
        focus_keyword: data.focusKeyword || null,
        og_image_url: data.ogImageUrl || null,
        og_title: data.ogTitle || null,
        og_description: data.ogDescription || null,
      };

      // Dispatch Redux Action
      await dispatch(updateBlog({ id, payload })).unwrap();
      
      // Clear tracking states and force navigation
      dispatch(setDirty(false));
      dispatch(clearCurrentBlog());
      router.push('/admin/blogs' as any);
      router.refresh(); // Refresh the list
      
    } catch (err: any) {
      setSubmitError(err || "An error occurred while updating the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hydration Guards
  if (isLoading && !currentBlog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-on-surface-variant gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm font-bold tracking-wider uppercase">Loading Post Data...</span>
      </div>
    );
  }

  if (error && !currentBlog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-error gap-3">
        <AlertCircle className="w-10 h-10" />
        <h2 className="text-lg font-bold">Failed to load article</h2>
        <p className="text-sm opacity-80">{error}</p>
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

  // Map Tags into a string array of NAMES for the Form schema & Backend
  const initialTags = (currentBlog as any).Tags 
    ? (currentBlog as any).Tags.map((t: any) => t.name)
    : currentBlog.tags || [];

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Edit Article</h1>
        <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
          Modifying existing content for <span className="font-bold text-primary">'{currentBlog.title}'</span>.
        </p>
      </div>
      
      <BlogEditor 
        mode="edit"
        initialData={{
          title: currentBlog.title,
          slug: currentBlog.slug,
          excerpt: currentBlog.excerpt,
          contentHtml: currentBlog.contentHtml,
          categoryId: currentBlog.categoryId,
          tags: initialTags,
          status: currentBlog.status,
          isFeatured: currentBlog.isFeatured,
          publishedAt: currentBlog.publishedAt,
          seoTitle: currentBlog.seoTitle,
          seoDescription: currentBlog.seoDescription,
          canonicalUrl: currentBlog.canonicalUrl,
          focusKeyword: currentBlog.focusKeyword,
          ogImageUrl: currentBlog.ogImageUrl,
          ogTitle: currentBlog.ogTitle,
          ogDescription: currentBlog.ogDescription,
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
}
