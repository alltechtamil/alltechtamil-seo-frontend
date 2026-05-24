"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createBlog, clearCurrentBlog } from '@/store/slices/blogsSlice';
import { setDirty } from '@/store/slices/blogEditorSlice';
import { BlogEditor, BlogFormData } from '@/components/admin/BlogEditor';
import { CreateBlogPayload } from '@/types/blog.types';

export default function CreateBlogPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Map frontend camelCase form data to backend snake_case API payload
      const payload: CreateBlogPayload = {
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
      await dispatch(createBlog(payload)).unwrap();
      
      // Clear tracking states and force navigation
      dispatch(setDirty(false));
      dispatch(clearCurrentBlog());
      router.push('/admin/blogs' as any);
      router.refresh(); // Refresh the list
      
    } catch (err: any) {
      setSubmitError(err || "An error occurred while creating the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Create New Article</h1>
        <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
          Draft a new blog post. Use the integrated toolbar to style text, inject images, and configure technical SEO metadata.
        </p>
      </div>
      
      <BlogEditor 
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
}
