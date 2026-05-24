"use client";

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDirty, clearEditor } from '@/store/slices/blogEditorSlice';
import { fetchAdminCategories } from '@/store/slices/categoriesSlice';

// Hooks
import { useImageUpload } from '@/hooks/useImageUpload';

// Sub-components
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { TagInput } from '@/components/admin/TagInput';
import { SeoPanel, SeoData } from '@/components/admin/SeoPanel';
import { PublishPanel, PublishData } from '@/components/admin/PublishPanel';

// ==========================================
// Zod Schema Definition
// ==========================================
const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  slug: z.string().optional().nullable(),
  excerpt: z.string().max(300, "Excerpt must be under 300 characters").optional().nullable(),
  contentHtml: z.string().min(12, "Content is required"),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().max(60).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  canonicalUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
  focusKeyword: z.string().optional().nullable(),
  ogImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  ogTitle: z.string().max(90).optional().nullable(),
  ogDescription: z.string().max(200).optional().nullable(),
});

export type BlogFormData = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
  mode: 'create' | 'edit';
}

export function BlogEditor({ 
  initialData, 
  onSubmit, 
  isSubmitting = false, 
  submitError = null,
  mode 
}: BlogEditorProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { upload } = useImageUpload();
  const { adminCategories } = useAppSelector((state) => state.categories);

  // Initialize React Hook Form
  const { 
    register, 
    handleSubmit, 
    control, 
    watch, 
    setValue, 
    formState: { errors, isDirty } 
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      contentHtml: initialData?.contentHtml || '',
      categoryId: initialData?.categoryId || '',
      tags: initialData?.tags || [],
      status: initialData?.status || 'draft',
      isFeatured: initialData?.isFeatured || false,
      publishedAt: initialData?.publishedAt || null,
      seoTitle: initialData?.seoTitle || '',
      seoDescription: initialData?.seoDescription || '',
      canonicalUrl: initialData?.canonicalUrl || '',
      focusKeyword: initialData?.focusKeyword || '',
      ogImageUrl: initialData?.ogImageUrl || '',
      ogTitle: initialData?.ogTitle || '',
      ogDescription: initialData?.ogDescription || '',
    }
  });

  // Watch properties for panel prop passing
  const currentStatus = watch('status');
  const currentPublishedAt = watch('publishedAt');
  const currentIsFeatured = watch('isFeatured');

  // Load Categories on mount
  useEffect(() => {
    dispatch(fetchAdminCategories(true));
  }, [dispatch]);

  // Handle Dirty State Tracking for Window Unload Events
  useEffect(() => {
    dispatch(setDirty(isDirty));
    
    // Attach listener to global window for external access
    (window as any)._blogEditorBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome to show prompt
      }
    };
    
    window.addEventListener('beforeunload', (window as any)._blogEditorBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', (window as any)._blogEditorBeforeUnload);
      dispatch(clearEditor());
    };
  }, [isDirty, dispatch]);

  // Submission Triggers mapped to PublishPanel
  const handleActionSubmit = (overrideStatus: 'draft' | 'published') => {
    setValue('status', overrideStatus, { shouldDirty: true });
    handleSubmit((data: any) => {
      // Physically unbind the beforeunload listener to guarantee no browser prompt collisions
      if ((window as any)._blogEditorBeforeUnload) {
        window.removeEventListener('beforeunload', (window as any)._blogEditorBeforeUnload);
      }
      dispatch(setDirty(false));
      onSubmit(data);
    })();
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 select-none">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <button 
          type="button" 
          onClick={() => {
            if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
              return;
            }
            router.push('/admin/blogs' as any);
          }}
          className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-3 py-1.5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>
        <div className="flex items-center gap-3">
          {submitError && (
            <span className="text-xs font-bold text-error flex items-center gap-1.5 px-3 py-1.5 bg-error/10 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" />
              {submitError}
            </span>
          )}
          {isDirty && (
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Unsaved Changes
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================= LEFT COLUMN: MAIN CONTENT ======================= */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Post Title & Slug */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
            <input
              type="text"
              {...register('title')}
              placeholder="Enter phenomenal article title here..."
              className="w-full text-2xl md:text-3xl font-extrabold text-on-surface bg-transparent border-none focus:ring-0 placeholder-on-surface-variant/40 outline-none"
            />
            {errors.title && <p className="text-xs text-error font-bold mt-2">{errors.title.message}</p>}

            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-md">
                /blog/
              </span>
              <input
                type="text"
                {...register('slug')}
                placeholder="auto-generated-from-title"
                className="flex-1 bg-transparent text-xs text-on-surface border-b border-outline-variant/40 focus:border-primary pb-1 outline-none transition-colors placeholder-on-surface-variant/50"
              />
            </div>
          </div>

          {/* Core TipTap Editor */}
          <div className="flex flex-col gap-1">
            <Controller
              name="contentHtml"
              control={control}
              render={({ field }) => (
                <RichTextEditor 
                  content={field.value} 
                  onChange={(html) => field.onChange(html)} 
                />
              )}
            />
            {errors.contentHtml && (
              <p className="text-xs text-error font-bold px-2">{errors.contentHtml.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
              Article Excerpt
            </label>
            <textarea
              {...register('excerpt')}
              placeholder="A brief 1-2 sentence summary shown on blog lists and cards..."
              rows={3}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none focus:border-primary transition-colors resize-none"
            />
            {errors.excerpt && <p className="text-xs text-error font-bold mt-1">{errors.excerpt.message}</p>}
          </div>

          {/* SEO Metadata Panel */}
          <Controller
            name="seoTitle"
            control={control}
            render={() => (
              <SeoPanel
                data={{
                  seoTitle: watch('seoTitle'),
                  seoDescription: watch('seoDescription'),
                  focusKeyword: watch('focusKeyword'),
                  canonicalUrl: watch('canonicalUrl'),
                  ogTitle: watch('ogTitle'),
                  ogDescription: watch('ogDescription')
                }}
                onChange={(field, val) => setValue(field as any, val, { shouldDirty: true, shouldValidate: true })}
                errors={{
                  seoTitle: errors.seoTitle?.message,
                  seoDescription: errors.seoDescription?.message,
                  canonicalUrl: errors.canonicalUrl?.message,
                  ogTitle: errors.ogTitle?.message,
                  ogDescription: errors.ogDescription?.message,
                }}
              />
            )}
          />

        </div>

        {/* ======================= RIGHT COLUMN: SIDEBAR CONTROLS ======================= */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">

          {/* Publish Action Panel */}
          <PublishPanel
            data={{ 
              status: currentStatus, 
              publishedAt: currentPublishedAt ?? null, 
              isFeatured: currentIsFeatured 
            }}
            onChange={(field, val) => setValue(field as any, val, { shouldDirty: true })}
            onSaveDraft={() => handleActionSubmit('draft')}
            onPublish={() => handleActionSubmit('published')}
            isSubmitting={isSubmitting}
          />

          {/* Taxonomy: Category */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
              Category
            </label>
            <select
              {...register('categoryId')}
              className="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary rounded-xl text-xs text-on-surface px-3 py-2.5 outline-none transition-colors cursor-pointer"
            >
              <option value="">Select a category...</option>
              {adminCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Taxonomy: Tags Combobox */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value}
                  onChange={(ids) => field.onChange(ids)}
                  error={errors.tags?.message}
                />
              )}
            />
          </div>

          {/* OpenGraph Cover Image */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
            <Controller
              name="ogImageUrl"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={(url) => field.onChange(url)}
                  onUpload={upload}
                  label="Cover Image"
                  helperText="Primary hero image (1200x630px recommended)"
                />
              )}
            />
            {errors.ogImageUrl && <p className="text-xs text-error font-bold mt-2">{errors.ogImageUrl.message}</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
