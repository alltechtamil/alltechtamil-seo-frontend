"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, CalendarDays, Clock, HelpCircle, Eye, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { BlogListItem } from '@/types/blog.types';
import { CustomImage } from '@/components/ui/CustomImage';
import { formatDate } from '@/lib/utils/formatDate';
import { formatReadTime } from '@/lib/utils/formatReadTime';
import { truncateText } from '@/lib/utils/truncateText';
import { getImageUrl } from '@/lib/utils/getImageUrl';

export interface SearchResultsProps {
    blogs: BlogListItem[];
}

export function SearchResults({ blogs }: SearchResultsProps) {
    const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'views'>('relevance');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedReadTime, setSelectedReadTime] = useState<'short' | 'medium' | 'long' | null>(null);
    const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);

    // Extract available categories dynamically from the loaded blogs
    const availableCategories = useMemo(() => {
        const map = new Map<string, { name: string; slug: string }>();
        blogs.forEach(blog => {
            const cat = blog.category || blog.Category;
            if (cat?.slug && cat?.name) {
                map.set(cat.slug, { name: cat.name, slug: cat.slug });
            }
        });
        return Array.from(map.values());
    }, [blogs]);

    // Apply client-side sorting and filtering dynamically
    const filteredAndSortedBlogs = useMemo(() => {
        let result = [...blogs];

        // 1. Filter by Category
        if (selectedCategory) {
            result = result.filter(blog => {
                const cat = blog.category || blog.Category;
                return cat?.slug === selectedCategory;
            });
        }

        // 2. Filter by Read Time
        if (selectedReadTime) {
            result = result.filter(blog => {
                if (selectedReadTime === 'short') return blog.readTimeMinutes <= 3;
                if (selectedReadTime === 'medium') return blog.readTimeMinutes > 3 && blog.readTimeMinutes <= 8;
                if (selectedReadTime === 'long') return blog.readTimeMinutes > 8;
                return true;
            });
        }

        // 3. Sort logic
        if (sortBy === 'newest') {
            result.sort((a, b) => {
                const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
                const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
                return dateB - dateA;
            });
        } else if (sortBy === 'views') {
            result.sort((a, b) => {
                const viewsA = parseInt((a as any).blogAnalytics?.totalViews || (a as any).BlogAnalytic?.totalViews || '0', 10);
                const viewsB = parseInt((b as any).blogAnalytics?.totalViews || (b as any).BlogAnalytic?.totalViews || '0', 10);
                return viewsB - viewsA;
            });
        }

        return result;
    }, [blogs, sortBy, selectedCategory, selectedReadTime]);

    if (blogs.length === 0) {
        return (
            <div className="py-24 text-center bg-surface-container-low rounded-3xl border border-outline-variant/40 max-w-4xl mx-auto px-6">
                <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
                <h2 className="text-on-surface font-bold text-2xl mb-3">No results found</h2>
                <p className="text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed text-sm md:text-base">
                    We couldn't find any articles matching your search query. Try checking your spelling, using different keywords, or broadening your search.
                </p>
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-on-primary px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md active:scale-95"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Filter and Sort bar */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
                    <div className="text-sm text-on-surface-variant font-medium">
                        Showing <span className="font-bold text-on-surface">{filteredAndSortedBlogs.length}</span> articles found
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Filter Trigger Button */}
                        <button
                            type="button"
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-xs font-bold ${
                                showFilterPanel || selectedCategory || selectedReadTime
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'
                            }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filter{(selectedCategory || selectedReadTime) ? ' (Active)' : ''}</span>
                        </button>

                        {/* Sort Trigger Button */}
                        <button
                            type="button"
                            onClick={() => {
                                setSortBy(prev => {
                                    if (prev === 'relevance') return 'newest';
                                    if (prev === 'newest') return 'views';
                                    return 'relevance';
                                });
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-outline-variant/60 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-xs font-bold text-on-surface"
                        >
                            <ArrowUpDown className="w-4 h-4 text-outline" />
                            <span>
                                Sort: {sortBy === 'relevance' ? 'Relevance' : sortBy === 'newest' ? 'Newest' : 'Popularity'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Premium Filter Panel Dropdown */}
                {showFilterPanel && (
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Category Filter Section - only show if there are multiple categories */}
                        {availableCategories.length > 1 && (
                            <div>
                                <h4 className="text-xs font-extrabold text-on-surface uppercase tracking-wider mb-3">Categories</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            selectedCategory === null
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                                        }`}
                                    >
                                        All
                                    </button>
                                    {availableCategories.map(cat => (
                                        <button
                                            key={cat.slug}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                selectedCategory === cat.slug
                                                    ? 'bg-primary text-on-primary'
                                                    : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Read Time Filter Section */}
                        <div>
                            <h4 className="text-xs font-extrabold text-on-surface uppercase tracking-wider mb-3">Read Time</h4>
                            <div className="flex flex-wrap gap-2">
                                {([
                                    { label: 'Any', value: null },
                                    { label: 'Short (≤ 3m)', value: 'short' },
                                    { label: 'Medium (3-8m)', value: 'medium' },
                                    { label: 'Long (> 8m)', value: 'long' }
                                ] as const).map(item => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => setSelectedReadTime(item.value)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            selectedReadTime === item.value
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {filteredAndSortedBlogs.length === 0 ? (
                <div className="py-16 text-center bg-surface-container-low rounded-3xl border border-outline-variant/40 max-w-2xl mx-auto px-6 w-full">
                    <SlidersHorizontal className="w-12 h-12 text-primary mx-auto mb-4 opacity-75" />
                    <h3 className="text-on-surface font-bold text-xl mb-2">No matching articles</h3>
                    <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed text-xs">
                        Try adjusting your filters (e.g., selecting "All Categories" or "Any Read Time") to see more articles.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {filteredAndSortedBlogs.map((blog, index) => {
                        // Alternating layout strategy based on card index:
                        // Card index 0, 3, 6, 9... will span 8 cols (Horizontal Card)
                        // Others will span 4 cols (Vertical Card)
                        const isHorizontal = index % 3 === 0;
                        
                        const href = `/blog/${blog.slug}`;
                        const imageSrc = getImageUrl(blog);
                        const categoryObj = blog.category || blog.Category;
                        const categoryName = categoryObj?.name || 'Blog';
                        const readTime = formatReadTime(blog.readTimeMinutes);
                        const dateDisplay = formatDate(blog.publishedAt);
                        const dateIso = blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : '';
                        const authorName = blog.author?.name || 'Editorial Team';
                        const views = (blog as any).blogAnalytics?.totalViews || (blog as any).BlogAnalytic?.totalViews || '0';

                        if (isHorizontal) {
                            return (
                                <div key={blog.id} className="md:col-span-8">
                                    <Link href={href as any} className="block group">
                                        <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 hover:border-outline hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all duration-300 relative h-full overflow-hidden">
                                            {/* Top Line Effect */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20 rounded-t-2xl" />
                                            
                                            {/* Image Left wrapper */}
                                            <div className="w-full sm:w-64 h-48 rounded-xl overflow-hidden flex-shrink-0 relative bg-surface-container-low">
                                                <CustomImage 
                                                    fill
                                                    src={imageSrc} 
                                                    alt={blog.title}
                                                    sizes="(max-width: 640px) 100vw, 256px"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
         
                                            {/* Details Right */}
                                            <div className="flex flex-col justify-between py-1 flex-grow">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                                                            {categoryName}
                                                        </span>
                                                        <span className="text-xs text-outline font-medium">• {readTime}</span>
                                                        {views !== '0' && (
                                                            <span className="text-xs text-outline font-medium flex items-center gap-1">
                                                                • <Eye className="w-3.5 h-3.5 opacity-70" /> {views} views
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <h2 className="font-display-lg text-xl md:text-2xl font-bold text-on-surface mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                        {blog.title}
                                                    </h2>
                                                    
                                                    <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed mb-4">
                                                        {truncateText(blog.excerpt || '', 140)}
                                                    </p>
                                                </div>
         
                                                <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full overflow-hidden relative border border-outline-variant/30">
                                                            <CustomImage 
                                                                fill
                                                                src={blog.author?.avatarUrl || '/images/default-avatar.png'} 
                                                                alt={authorName} 
                                                                sizes="28px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-on-surface">{authorName}</span>
                                                            {dateDisplay && (
                                                                <span className="text-[10px] text-outline font-medium">{dateDisplay}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {(() => {
                                                        const tagsList = blog.tags || blog.Tags;
                                                        return tagsList && tagsList.length > 0 && (
                                                            <div className="flex gap-1.5 overflow-hidden max-w-[150px]">
                                                                {tagsList.slice(0, 2).map((t: any) => (
                                                                    <span key={t.id} className="text-[10px] font-bold text-outline uppercase tracking-wider">
                                                                        #{t.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </div>
                            );
                        }

                        // Vertical Card layout
                        return (
                            <div key={blog.id} className="md:col-span-4">
                                <Link href={href as any} className="block h-full group">
                                    <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 flex flex-col h-full hover:border-outline hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden">
                                        {/* Top Line Effect */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-tertiary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20 rounded-t-2xl" />

                                        <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative bg-surface-container-low flex-shrink-0">
                                            <CustomImage 
                                                fill
                                                src={imageSrc} 
                                                alt={blog.title}
                                                sizes="(max-width: 768px) 100vw, 320px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-grow">
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                                                    {categoryName}
                                                </span>
                                                {views !== '0' && (
                                                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5 opacity-75" /> {views}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-display-lg text-lg font-bold text-on-surface mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {blog.title}
                                            </h3>

                                            <p className="text-on-surface-variant text-sm line-clamp-3 leading-relaxed mb-6">
                                                {truncateText(blog.excerpt || '', 100)}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center text-xs text-outline font-medium">
                                                {dateIso && (
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarDays className="w-3.5 h-3.5" />
                                                        <time dateTime={dateIso}>{dateDisplay}</time>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{readTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
