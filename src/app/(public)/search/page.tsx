import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

import { searchBlogs } from '@/lib/api/public/blogs.api';
import { SearchHero } from '@/components/search/SearchHero';
import { SearchResults } from '@/components/search/SearchResults';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { buildSeoMetadata } from '@/lib/utils/seo.helper';
import type { BlogListItem } from '@/types/blog.types';

const POSTS_PER_PAGE = 9;

interface SearchPageProps {
    searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q || '';
    
    const title = query ? `Search Results for "${query}" | AllTechTamil` : 'Search Articles | AllTechTamil';
    const description = query 
        ? `Browse all published articles matching "${query}" on the AllTechTamil blog.`
        : 'Search our library of articles on tech, programming, AI, and more.';
    const path = query 
        ? `/search?q=${encodeURIComponent(query)}`
        : '/search';

    return buildSeoMetadata({
        title,
        description,
        path,
    });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedParams = await searchParams;
    const rawQuery = resolvedParams.q || '';
    const query = rawQuery.trim();
    const currentPage = Math.max(1, parseInt(resolvedParams.page || '1', 10));

    let posts: BlogListItem[] = [];
    let totalPages = 1;
    let totalCount = 0;
    let timing = 0;

    if (query) {
        try {
            const start = Date.now();
            const res = await searchBlogs(query, currentPage, POSTS_PER_PAGE);
            timing = (Date.now() - start) / 1000;
            
            posts = res.data || [];
            totalPages = res.meta?.totalPages || 1;
            totalCount = res.meta?.totalCount || 0;
        } catch (error) {
            console.error('[SearchPage] Failed to fetch search results:', error);
        }
    }

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Search' }
    ];

    const heroTitle = query ? `Results for "${query}"` : 'Search the library';
    const heroSubtitle = query 
        ? `Showing ${posts.length > 0 ? `${(currentPage - 1) * POSTS_PER_PAGE + 1}-${Math.min(currentPage * POSTS_PER_PAGE, totalCount)}` : '0'} of ${totalCount} results found in ${timing.toFixed(2)} seconds`
        : 'Explore our articles on tech, programming, AI, and modern web engineering';

    return (
        <div className="max-w-7xl mx-auto px-gutter py-12 md:py-16">
            {/* Breadcrumb section */}
            <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Search Input and Hero details */}
            <SearchHero 
                initialQuery={query}
                title={heroTitle}
                subtitle={heroSubtitle}
            />



            {/* Search Results Grid */}
            <div className="mb-14">
                {query ? (
                    <SearchResults blogs={posts} />
                ) : (
                    <div className="py-24 text-center bg-surface-container-low rounded-3xl border border-outline-variant/40 max-w-4xl mx-auto px-6">
                        <Search className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
                        <h2 className="text-on-surface font-bold text-2xl mb-3">Find anything in our library</h2>
                        <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed text-sm md:text-base">
                            Enter any keyword, tag, or topic above to instantly search through our highly optimized tech articles.
                        </p>
                    </div>
                )}
            </div>

            {/* URL-based Pagination */}
            {query && totalPages > 1 && (
                <nav aria-label="Search pagination" className="flex items-center justify-center gap-2">
                    {/* Previous */}
                    {currentPage > 1 ? (
                        <Link
                            href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                            className="px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface font-bold text-sm hover:bg-surface-container-high hover:border-outline transition-all"
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
                                    href={`/search?q=${encodeURIComponent(query)}&page=${page}`}
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
                            href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
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
        </div>
    );
}
