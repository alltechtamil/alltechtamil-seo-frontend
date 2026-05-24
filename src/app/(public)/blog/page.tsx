import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen } from 'lucide-react';

import { BlogCard } from '@/components/blog/BlogCard';
import { getPublicBlogs } from '@/lib/api/public/blogs.api';
import { buildSeoMetadata } from '@/lib/utils/seo.helper';
import { JsonLd } from '@/components/seo/JsonLd';
import { envConfig } from '@/config/env.config';
import type { BlogListItem } from '@/types/blog.types';

// --- Metadata ---
export async function generateMetadata({ searchParams }: BlogListingPageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const currentPage = Math.max(1, parseInt(resolvedParams.page || '1', 10));
    
    const isFirstPage = currentPage === 1;
    const title = isFirstPage 
        ? 'All Articles | AllTechTamil' 
        : `All Articles – Page ${currentPage} | AllTechTamil`;
    const description = isFirstPage
        ? 'Browse all published articles on tech, programming, AI, and more from the AllTechTamil blog.'
        : `Browse all published articles on tech, programming, AI, and more (Page ${currentPage}) from the AllTechTamil blog.`;
    const path = isFirstPage ? '/blog' : `/blog?page=${currentPage}`;

    return buildSeoMetadata({
        title,
        description,
        path,
    });
}

// ISR: revalidate every hour
export const revalidate = 3600;

const POSTS_PER_PAGE = 9;

interface BlogListingPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function BlogListingPage({ searchParams }: BlogListingPageProps) {
    const resolvedParams = await searchParams;
    const currentPage = Math.max(1, parseInt(resolvedParams.page || '1', 10));

    let posts: BlogListItem[] = [];
    let totalPages = 1;
    let totalCount = 0;

    try {
        const res = await getPublicBlogs({
            page: currentPage,
            limit: POSTS_PER_PAGE,
            status: 'published',
        });
        posts = res.data || [];
        totalPages = res.meta?.totalPages || 1;
        totalCount = res.meta?.total || 0;
    } catch (error) {
        console.error('[BlogListingPage] Failed to fetch blogs:', error);
    }

    return (
        <div className="max-w-7xl mx-auto px-gutter py-12 md:py-16">
            {/* Page Header */}
            <header className="mb-12 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="text-primary text-xs font-extrabold uppercase tracking-widest">All Articles</span>
                </div>
                <h1 className="font-display-lg text-4xl md:text-5xl font-extrabold text-on-surface m-0 leading-tight">
                    The AllTechTamil Blog
                </h1>
                <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                    {totalCount > 0
                        ? `${totalCount} articles on tech, programming, AI, and more.`
                        : 'In-depth articles on tech, programming, AI, and more.'}
                </p>

                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-outline mt-1">
                    <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
                    <span>/</span>
                    <span className="text-on-surface font-semibold">Blog</span>
                </nav>
            </header>

            {/* Blog Grid */}
            {posts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
                        {posts.map((post, idx) => (
                            <BlogCard key={`${post.id}-${idx}`} post={post} />
                        ))}
                    </div>

                    {/* URL-based Pagination */}
                    {totalPages > 1 && (
                        <nav aria-label="Blog pagination" className="flex items-center justify-center gap-2">
                            {/* Previous */}
                            {currentPage > 1 ? (
                                <Link
                                    href={`/blog?page=${currentPage - 1}`}
                                    className="px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface font-bold text-sm hover:bg-surface-container-high hover:border-outline transition-all flex items-center gap-1.5"
                                    aria-label="Previous page"
                                >
                                    ← Prev
                                </Link>
                            ) : (
                                <span className="px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-outline font-bold text-sm opacity-50 cursor-not-allowed">
                                    ← Prev
                                </span>
                            )}

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    const page = i + 1;
                                    const isActive = page === currentPage;
                                    return (
                                        <Link
                                            key={page}
                                            href={`/blog?page=${page}`}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${
                                                isActive
                                                    ? 'bg-primary text-on-primary shadow-sm'
                                                    : 'bg-surface-container border border-outline-variant/60 text-on-surface hover:bg-surface-container-high'
                                            }`}
                                            aria-current={isActive ? 'page' : undefined}
                                        >
                                            {page}
                                        </Link>
                                    );
                                })}
                                {totalPages > 7 && (
                                    <span className="w-10 h-10 flex items-center justify-center text-outline">...</span>
                                )}
                            </div>

                            {/* Next */}
                            {currentPage < totalPages ? (
                                <Link
                                    href={`/blog?page=${currentPage + 1}`}
                                    className="px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface font-bold text-sm hover:bg-surface-container-high hover:border-outline transition-all flex items-center gap-1.5"
                                    aria-label="Next page"
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <span className="px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-outline font-bold text-sm opacity-50 cursor-not-allowed flex items-center gap-1.5">
                                    Next <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </nav>
                    )}
                </>
            ) : (
                <div className="py-24 text-center bg-surface-container-low rounded-3xl border border-outline-variant/40">
                    <BookOpen className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                    <h2 className="text-on-surface font-bold text-xl mb-2">No articles yet</h2>
                    <p className="text-outline-variant mb-6">Check back soon — new content is on the way!</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
                        Back to Home
                    </Link>
                </div>
            )}
            <JsonLd
                type="combined"
                breadcrumbs={[
                    { position: 1, name: 'Home', item: envConfig.siteUrl || 'https://www.alltechtamil.in/' },
                    { position: 2, name: 'Blog', item: `${(envConfig.siteUrl || 'https://www.alltechtamil.in/').replace(/\/$/, '')}/blog` }
                ]}
            />
        </div>
    );
}
