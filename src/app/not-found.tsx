import React from 'react';
import Link from 'next/link';
import { Home, Search, Sparkles } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { BlogCard } from '@/components/blog/BlogCard';
import { getPublicBlogs } from '@/lib/fetchers/blog.fetcher';
import type { BlogListItem } from '@/types/blog.types';

// Revalidate this page's trending blogs dynamic fetch in the background every 300 seconds (5 minutes)
export const revalidate = 300;

export default async function NotFound() {
    let trendingBlogs: BlogListItem[] = [];
    try {
        const res = await getPublicBlogs({ page: 1, limit: 3, status: 'published' });
        trendingBlogs = res.data || [];
    } catch (error) {
        console.error('[NotFound] Failed to fetch trending blogs for 404 page:', error);
    }

    return (
        <PublicLayout>
            <div className="max-w-7xl mx-auto px-gutter py-12 md:py-2 flex flex-col items-center justify-center text-center">
                
                {/* Massive Premium Text-Gradient Hero Header */}
                <div className="relative mb-6 select-none">
                    {/* Soft ambient background glow */}
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-60 scale-75" />
                    
                    <h1 className="text-7xl sm:text-[8rem] md:text-[10rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-tertiary/20">
                        404
                    </h1>
                </div>

                {/* Typography Block */}
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4 max-w-2xl leading-tight">
                    Lost in the Tech Space?
                </h2>
                <p className="text-on-surface-variant text-sm sm:text-base md:text-lg max-w-md sm:max-w-lg leading-relaxed mb-10">
                    The page you are looking for has either migrated, updated, or does not exist. Let us help you find your way back.
                </p>

                {/* Global Search Bar (Highly responsive pill styling) */}
                <div className="w-full max-w-lg mb-12 px-2 sm:px-0">
                    <form
                        action="/search"
                        method="GET"
                        className="relative flex items-center bg-surface-container-low border border-outline-variant/60 rounded-2xl p-1.5 shadow-inner focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all"
                    >
                        <Search className="absolute left-4 text-outline w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                            name="q"
                            className="w-full bg-transparent text-on-surface placeholder:text-outline-variant text-xs sm:text-sm pl-10 sm:pl-12 pr-20 sm:pr-24 py-2 sm:py-2.5 outline-none"
                            placeholder="Search articles and prompts..."
                            type="text"
                        />
                        <button type="submit" className="absolute right-1.5 bg-primary hover:bg-primary/90 text-on-primary px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95">
                            Search
                        </button>
                    </form>
                </div>

                {/* Navigation CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full max-w-xs sm:max-w-none">
                    <Link href={"/" as any} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-md">
                        <Home className="w-4 h-4" />
                        <span>Go back Home</span>
                    </Link>
                    <Link href={"/blog" as any} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-low border border-outline-variant/60 text-on-surface hover:bg-surface-container-high rounded-xl text-sm font-bold transition-all shadow-sm">
                        <span>Browse All Articles</span>
                    </Link>
                </div>

                {/* Dynamic Trending / Recommended Blogs Section */}
                {trendingBlogs.length > 0 && (
                    <section className="w-full pt-12 border-t border-outline-variant/30 text-left">
                        <div className="flex items-center gap-2 mb-8">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h3 className="text-xl md:text-2xl font-extrabold text-on-surface tracking-tight m-0">
                                Recommended for You
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trendingBlogs.map((blog) => (
                                <BlogCard key={blog.id} post={blog} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}
