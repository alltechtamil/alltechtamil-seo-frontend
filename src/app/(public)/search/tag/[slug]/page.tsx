import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tag as TagIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlogsByTagSlug } from '@/lib/api/public/blogs.api';
import { getPublicCategories } from '@/lib/fetchers/category.fetcher';
import { getPublicTags, getPublicTag } from '@/lib/fetchers/tag.fetcher';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { AdUnit } from '@/components/ads/AdUnit';
import { CustomImage } from '@/components/ui/CustomImage';
import { buildSeoMetadata } from '@/lib/utils/seo.helper';
import { formatDate } from '@/lib/utils/formatDate';
import { formatReadTime } from '@/lib/utils/formatReadTime';
import { getImageUrl } from '@/lib/utils/getImageUrl';
import { ROUTES } from '@/constants/routes';
import type { BlogListItem } from '@/types/blog.types';



const POSTS_PER_PAGE = 9;

interface TagPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
    try {
        const res = await getPublicTags(true); // Pre-render popular tags at build time
        return (res.data || []).map((tag) => ({
            slug: tag.slug,
        }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const res = await getPublicTag(slug);
        const tag = res.data;
        if (!tag) {
            return buildSeoMetadata({
                title: 'Tag Not Found | AllTechTamil',
                description: 'The requested tag could not be found.',
                path: `/search/tag/${slug}`,
                index: false
            });
        }

        const title = `Articles Tagged with #${tag.name} | AllTechTamil`;
        const description = `Read high-quality articles tagged with #${tag.name} on the AllTechTamil blog.`;

        return buildSeoMetadata({
            title,
            description,
            path: `/search/tag/${slug}`,
        });
    } catch {
        return buildSeoMetadata({
            title: 'Tag Not Found | AllTechTamil',
            description: 'The requested tag could not be found.',
            path: `/search/tag/${slug}`,
            index: false
        });
    }
}

export default async function TagSearchPage({ params, searchParams }: TagPageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10));

    let tag;
    try {
        const res = await getPublicTag(slug);
        tag = res.data;
    } catch (error: any) {
        console.error('[TagSearchPage] Failed to fetch tag:', error?.message || error);
    }

    if (!tag) {
        notFound();
    }

    let posts: BlogListItem[] = [];
    let totalPages = 1;
    let totalCount = 0;

    try {
        const res = await getBlogsByTagSlug(slug, currentPage, POSTS_PER_PAGE);
        posts = res.data || [];
        totalPages = res.meta?.totalPages || 1;
        totalCount = res.meta?.totalCount || 0;
    } catch (error) {
        console.error('[TagSearchPage] Failed to fetch tag blogs:', error);
    }

    // Sidebar Data Fetching
    let categories: any[] = [];
    let tags: any[] = [];
    try {
        const [categoriesRes, tagsRes] = await Promise.all([
            getPublicCategories(),
            getPublicTags(true)
        ]);
        categories = categoriesRes.data || [];
        tags = tagsRes.data || [];
    } catch (error) {
        console.error('[TagSearchPage] Failed to fetch sidebar items:', error);
    }

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Search', href: '/search' },
        { label: 'Tag' },
        { label: `#${tag.name}` }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            {/* Breadcrumbs */}
            <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Top Ad */}
            <AdUnit 
                placement="SEARCH_TOP" 
                wrapperClassName="w-full mb-12 bg-surface-container-low border border-dashed border-outline-variant/30 flex items-center justify-center rounded-xl overflow-hidden py-4 text-center"
            />

            {/* Tag Banner */}
            <section className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/30 pb-8 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <TagIcon className="w-5 h-5 text-primary" />
                            <span className="text-xs font-bold text-primary tracking-widest uppercase">Tag Archive</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface mb-6">#{tag.name}</h1>
                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                            Discover all curated articles, resources, and insights tagged under the #{tag.name} taxonomy.
                        </p>
                    </div>
                    <div className="bg-surface-container-highest px-6 py-4 rounded-xl border border-outline-variant/20 min-w-[160px] text-center md:text-right">
                        <div className="text-3xl md:text-4xl font-extrabold text-primary">{totalCount}</div>
                        <span className="text-[10px] font-extrabold text-on-surface-variant tracking-wider uppercase">Published Guides</span>
                    </div>
                </div>
            </section>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Blogs Grid) */}
                <div className="lg:col-span-8 space-y-12">
                    {posts.length === 0 ? (
                        <div className="py-24 text-center bg-surface-container-low rounded-3xl border border-outline-variant/40 px-6 max-w-2xl mx-auto">
                            <TagIcon className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
                            <h2 className="text-on-surface font-bold text-2xl mb-3">No articles found</h2>
                            <p className="text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed text-sm">
                                We couldn't find any articles published under this tag yet.
                            </p>
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-on-primary px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md active:scale-95"
                            >
                                Back to Home
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Featured Blog */}
                            {currentPage === 1 && posts[0] && (
                                <div className="group">
                                    <article className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden flex flex-col md:flex-row h-full hover:border-outline hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                                        <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-surface-container-low">
                                            <CustomImage 
                                                fill
                                                src={getImageUrl(posts[0])} 
                                                alt={posts[0].title}
                                                sizes="(max-width: 768px) 100vw, 400px"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    Featured
                                                </span>
                                            </div>
                                        </div>
                                        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-4 mb-4 text-xs text-outline font-medium">
                                                    <span>{formatDate(posts[0].publishedAt)}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                                                    <span>{formatReadTime(posts[0].readTimeMinutes)}</span>
                                                </div>
                                                <Link href={ROUTES.BLOG_DETAIL(posts[0].slug) as any}>
                                                    <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                                        {posts[0].title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                                                    {posts[0].excerpt || ''}
                                                </p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-outline-variant/30">
                                                        <CustomImage 
                                                            fill
                                                            src={posts[0].author?.avatarUrl || '/images/default-avatar.png'} 
                                                            alt={posts[0].author?.name || 'Author'} 
                                                            sizes="32px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-on-surface">{posts[0].author?.name || 'Editorial Team'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            )}

                            {/* Regular Blogs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(currentPage === 1 ? posts.slice(1) : posts).map((blog) => (
                                    <article key={blog.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden flex flex-col h-full hover:border-outline hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group">
                                        <div className="h-48 overflow-hidden relative bg-surface-container-low">
                                            <CustomImage 
                                                fill
                                                src={getImageUrl(blog)} 
                                                alt={blog.title}
                                                sizes="(max-width: 768px) 100vw, 350px"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-3 text-xs text-outline font-medium">
                                                    <span className="text-primary font-bold uppercase tracking-wider">#{tag.name}</span>
                                                    <span>•</span>
                                                    <span>{formatReadTime(blog.readTimeMinutes)}</span>
                                                </div>
                                                <Link href={ROUTES.BLOG_DETAIL(blog.slug) as any}>
                                                    <h4 className="text-base font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                                        {blog.title}
                                                    </h4>
                                                </Link>
                                                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-6">
                                                    {blog.excerpt || ''}
                                                </p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between text-xs text-outline font-medium">
                                                <span>{formatDate(blog.publishedAt)}</span>
                                                <span>By {blog.author?.name || 'Editorial Team'}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="pt-8 flex items-center justify-center gap-2">
                                    {currentPage > 1 ? (
                                        <Link
                                            href={`/search/tag/${slug}?page=${currentPage - 1}`}
                                            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-outline hover:text-primary"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Link>
                                    ) : (
                                        <span className="p-2.5 rounded-lg bg-surface-container text-outline opacity-40 cursor-not-allowed">
                                            <ChevronLeft className="w-5 h-5" />
                                        </span>
                                    )}

                                    {Array.from({ length: totalPages }, (_, i) => {
                                        const pageNum = i + 1;
                                        const isActive = pageNum === currentPage;
                                        return (
                                            <Link
                                                key={pageNum}
                                                href={`/search/tag/${slug}?page=${pageNum}`}
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${
                                                    isActive
                                                        ? 'bg-primary text-on-primary shadow-sm'
                                                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                                                }`}
                                            >
                                                {pageNum}
                                            </Link>
                                        );
                                    })}

                                    {currentPage < totalPages ? (
                                        <Link
                                            href={`/search/tag/${slug}?page=${currentPage + 1}`}
                                            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-outline hover:text-primary"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Link>
                                    ) : (
                                        <span className="p-2.5 rounded-lg bg-surface-container text-outline opacity-40 cursor-not-allowed">
                                            <ChevronRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Right Column (Sidebar) */}
                <aside className="lg:col-span-4 space-y-8">
                    {/* Search Widget */}
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                        <h5 className="text-sm md:text-base font-bold text-on-surface mb-4">Search Articles</h5>
                        <form action="/search" method="GET" className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-outline text-on-surface"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                            </div>
                            <button
                                type="submit"
                                className="px-4 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Related Categories */}
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                        <h5 className="text-sm md:text-base font-bold text-on-surface mb-6">Related Categories</h5>
                        <div className="space-y-4">
                            {categories.slice(0, 8).map((cat) => {
                                return (
                                    <Link 
                                        key={cat.id} 
                                        href={ROUTES.CATEGORY(cat.slug) as any}
                                        className="flex items-center justify-between group py-1.5 px-3 rounded-lg transition-all text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                                    >
                                        <span className="text-sm">{cat.name}</span>
                                        <span className="text-[10px] font-bold bg-surface-container px-2 py-0.5 rounded text-outline group-hover:text-primary">
                                            {cat.blogsCount ?? 0}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Popular Tags */}
                    {tags.length > 0 && (
                        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                            <h5 className="text-sm md:text-base font-bold text-on-surface mb-6">Popular Tags</h5>
                            <div className="flex flex-wrap gap-2">
                                {tags.slice(0, 12).map((t) => {
                                    const isActive = t.slug === slug;
                                    return (
                                        <Link
                                            key={t.id}
                                            href={ROUTES.TAG(t.slug) as any}
                                            className={`px-3 py-1 border rounded-full text-xs font-semibold transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-primary text-on-primary border-primary font-bold'
                                                    : 'bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary'
                                            }`}
                                        >
                                            {t.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Sticky Sidebar Ad */}
                    <div className="sticky top-24">
                        <AdUnit 
                            placement="BLOG_SIDEBAR" 
                            wrapperClassName="w-full h-[350px] bg-surface-container-low border border-dashed border-outline-variant flex flex-col items-center justify-center rounded-xl overflow-hidden relative group text-center p-6"
                        />
                    </div>
                </aside>
            </div>

            {/* Bottom Ad */}
            <AdUnit 
                placement="SEARCH_BOTTOM" 
                wrapperClassName="w-full mt-16 bg-surface-container-low border border-dashed border-outline-variant/30 flex items-center justify-center rounded-xl overflow-hidden py-4 text-center"
            />
        </div>
    );
}
