import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { BlogCard } from '@/components/blog/BlogCard';
import { Pagination } from '@/components/ui/Pagination';
import type { BlogListItem } from '@/types/blog.types';

export interface RecentBlogsProps {
    posts: BlogListItem[];
    currentPage?: number;
    totalPages?: number;
}

export function RecentBlogs({ posts, currentPage = 1, totalPages = 1 }: RecentBlogsProps) {
    return (
        <section aria-labelledby="latest-insights-title" className="lg:col-span-9">
            <header className="mb-10 flex items-end justify-between border-b border-outline-variant/30 pb-4">
                <div className="flex flex-col gap-1">
                    <span className="text-primary text-xs font-extrabold uppercase tracking-widest">Feed</span>
                    <h2 id="latest-insights-title" className="font-headline-md text-3xl font-extrabold m-0 text-on-surface">Latest Insights</h2>
                </div>
                <Link className="text-primary text-sm font-bold flex items-center gap-1.5 group hover:text-primary-focus transition-colors bg-primary/10 px-4 py-2 rounded-lg" href={"/blog" as any} title="View all recent insights">
                    View All <ArrowRight className="w-[16px] h-[16px] group-hover:translate-x-1 transition-transform" />
                </Link>
            </header>

            {posts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {posts.map((post, idx) => (
                            <BlogCard key={`${post.id}-${idx}`} post={post} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12">
                            <Pagination currentPage={currentPage} totalPages={totalPages} />
                        </div>
                    )}
                </>
            ) : (
                <div className="py-20 text-center bg-surface-container-low rounded-3xl border border-outline-variant/40">
                    <p className="text-outline-variant font-bold">No recent posts found.</p>
                </div>
            )}

            {/* Bottom Inline Search */}
            <div className="mt-10 md:mt-12 bg-surface-container-low border border-outline-variant/40 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-sm">
                <h3 className="text-on-surface font-headline-md text-md md:text-xl font-extrabold mb-4 tracking-tight">Didn&apos;t find what you were looking for?</h3>
                <form
                    action="/search"
                    className="w-full max-w-2xl relative flex items-center bg-surface-container-lowest border border-outline-variant/60 rounded-full p-1.5 md:p-2 shadow-inner focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all"
                >
                    <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-outline w-4 md:w-5 h-4 md:h-5" />
                    <input
                        name="q"
                        className="w-full bg-transparent text-on-surface placeholder:text-outline-variant text-sm md:text-base pl-10 md:pl-12 pr-3 md:pr-4 py-1.5 md:py-2 outline-none"
                        placeholder="Search anything..."
                        type="text"
                    />
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-on-primary px-5 md:px-8 py-2 md:py-2.5 rounded-full text-sm md:text-base font-bold transition-all shadow-md active:scale-95">
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
}
