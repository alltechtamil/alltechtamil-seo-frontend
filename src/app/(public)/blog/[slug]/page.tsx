import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicBlogBySlug, getRelatedBlogs, getPublicBlogs } from '@/lib/fetchers/blog.fetcher';
import { buildSeoMetadata } from '@/lib/utils/seo.helper';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { AdUnit } from '@/components/ads/AdUnit';
import { BlogMeta } from '@/components/blog/BlogMeta';
import { BlogContent } from '@/components/blog/BlogContent';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { RelatedBlogs } from '@/components/blog/RelatedBlogs';
import { ViewTracker } from '@/components/blog/ViewTracker';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { JsonLd } from '@/components/seo/JsonLd';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { CustomImage } from '@/components/ui/CustomImage';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';
import { envConfig } from '@/config/env.config';
import { getImageUrl } from '@/lib/utils/getImageUrl';
import { BlogListItem } from '@/types/blog.types';

export const revalidate = 120; // ISR revalidation every 2 minutes

export async function generateStaticParams() {
    try {
        const res = await getPublicBlogs({ limit: 100 });
        return (res.data || []).map(blog => ({
            slug: blog.slug,
        }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const response = await getPublicBlogBySlug(slug);
        const blog = response.data;
        if (!blog) return buildSeoMetadata({ title: 'Not Found', description: '', path: `/blog/${slug}` });
        
        const featuredImageObj = getImageUrl(blog as any);
        const featuredImageUrl = typeof featuredImageObj === 'string' ? featuredImageObj : featuredImageObj.src;
        
        const tagsList = ((blog as any).Tags || blog.tags || []) as any[];
        const keywords = blog.focusKeyword 
            ? [blog.focusKeyword, ...tagsList.map((t: any) => t.name)] 
            : tagsList.map((t: any) => t.name);

        return buildSeoMetadata({
            title: `${blog.seoTitle || blog.title} | AllTechTamil`,
            description: blog.seoDescription || blog.excerpt || '',
            image: featuredImageUrl,
            type: 'article',
            path: `/blog/${slug}`,
            keywords: keywords.length > 0 ? keywords : undefined,
        });
    } catch {
        return buildSeoMetadata({ title: 'Not Found', description: '', path: `/blog/${slug}` });
    }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    let blog;
    let relatedBlogs: BlogListItem[] = [];
    
    try {
        const response = await getPublicBlogBySlug(slug);
        blog = response.data;
        
        // Handle Prisma casing variations
        const category = (blog as any)?.Category || blog?.category;
        
        if (category?.id) {
            relatedBlogs = await getRelatedBlogs(category.id, blog.id, 3);
        }
    } catch (error) {
        console.error("Failed to fetch blog:", error);
    }
    
    if (!blog) {
        notFound();
    }

    // Standardize object mappings to cover edge cases with Prisma include casing
    const anyBlog = blog as any;
    const category = anyBlog.Category || blog.category;
    const tags = anyBlog.Tags || blog.tags || [];
    const images = anyBlog.Images || blog.images || [];
    const author = blog.author || anyBlog.Author;
    const publishedAt = blog.publishedAt || anyBlog.createdAt;
    const readTimeMinutes = blog.readTimeMinutes || 1;

    const featuredImageObj = getImageUrl(blog as any);
    const featuredImageUrl = typeof featuredImageObj === 'string' ? featuredImageObj : featuredImageObj.src;
    
    const baseSiteUrl = envConfig.siteUrl.endsWith('/') ? envConfig.siteUrl : `${envConfig.siteUrl}/`;

    // Breadcrumb Data
    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Home', href: ROUTES.HOME },
    ];
    if (category) {
        breadcrumbItems.push({ 
            label: category.name, 
            href: `/search/category/${category.slug}` 
        });
    }
    breadcrumbItems.push({ label: blog.title });

    // 100x Better Structured Data for SEO: Premium BlogPosting Schema
    const tagsList = (tags || []) as any[];
    const keywordsArray = blog.focusKeyword 
        ? [blog.focusKeyword, ...tagsList.map((t: any) => t.name)] 
        : tagsList.map((t: any) => t.name);

    const articleStructuredData = blog.structuredData || {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.seoTitle || blog.title,
        "alternativeHeadline": blog.title,
        "description": blog.seoDescription || blog.excerpt,
        "image": featuredImageUrl,
        "datePublished": publishedAt,
        "dateModified": blog.updatedAt || publishedAt,
        "keywords": keywordsArray.join(', '),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseSiteUrl}blog/${blog.slug}`
        },
        "author": {
            "@type": "Person",
            "name": author?.name || "Editorial Team",
            "url": baseSiteUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "All Tech Tamil",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseSiteUrl}favicon-96x96.png`
            }
        }
    };

    const breadcrumbStructuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => {
            const cleanHref = item.href 
                ? (item.href.startsWith('/') ? item.href.slice(1) : item.href) 
                : undefined;
            return {
                "@type": "ListItem",
                "position": index + 1,
                "name": item.label,
                "item": item.href ? `${baseSiteUrl}${cleanHref}` : undefined
            };
        })
    };

    return (
        <>
            <ReadingProgress />
            <ViewTracker blogId={blog.id} />
            <JsonLd data={articleStructuredData as Record<string, unknown>} />
            <JsonLd data={breadcrumbStructuredData as Record<string, unknown>} />

            {/* Top Ad */}
            <AdUnit 
                placement="BLOG_TOP" 
                wrapperClassName="w-full flex justify-center py-8 bg-surface-container-low border-b border-outline-variant/30"
                className="w-full max-w-4xl" 
            />

            <main className="w-full">
                {/* Article Header */}
                <section className="max-w-7xl mx-auto px-gutter mt-12">
                    <Breadcrumb items={breadcrumbItems} className="mb-8" />
                    
                    <header className="mb-8 max-w-3xl">
                        {category && (
                            <Badge variant="primary" className="mb-4">
                                {category.name}
                            </Badge>
                        )}
                        <h1 className="font-bold text-4xl md:text-5xl text-on-background mb-6 leading-tight tracking-tight">
                            {blog.title}
                        </h1>
                        <BlogMeta 
                            author={author} 
                            publishedAt={publishedAt} 
                            readTimeMinutes={readTimeMinutes} 
                        />
                    </header>
                </section>

                {/* Featured Image */}
                <div className="w-full mb-16">
                    <div className="w-full h-[400px] md:h-[600px] relative">
                        {images.length > 0 || featuredImageUrl !== '/images/no-image.png' ? (
                                <CustomImage 
                                src={featuredImageUrl} 
                                alt={blog.title} 
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                                className="object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                                <span className="text-on-surface-variant/50">No Image Available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content & Sidebar */}
                <div className="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row justify-between gap-12 lg:gap-16">
                    {/* Article Body */}
                    <article className="w-full md:max-w-3xl shrink-0">
                        <AdUnit placement="BLOG_INLINE_1" className="mb-8" />
                        
                        <BlogContent html={blog.contentHtml} />
                        
                        <AdUnit placement="BLOG_INLINE_2" className="mt-8" />

                        {/* Mobile Tags & Share (Hidden on Desktop) */}
                        <div className="md:hidden mt-12 flex flex-col gap-8">
                            {tags.length > 0 && (
                                <nav aria-label="Article Tags">
                                    <h3 className="font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-4">TAGS</h3>
                                    <ul className="flex flex-wrap gap-2">
                                        {tags.map((tag: any) => (
                                            <li key={tag.id}>
                                                <Link 
                                                    href={`/search/tag/${tag.slug}` as any}
                                                    className="px-3 py-1 bg-surface-container-low border border-outline-variant/50 hover:border-primary/50 text-xs font-medium rounded-lg text-on-surface-variant hover:text-primary transition-colors block"
                                                >
                                                    #{tag.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                            <ShareButtons title={blog.title} />
                        </div>

                        {/* Author Bio Card */}
                        {author && (
                            <section aria-label="About the author" className="mt-20 p-8 bg-surface-container-low rounded-2xl border border-outline-variant/50 flex flex-col md:flex-row gap-8">
                                <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
                                    <CustomImage 
                                        src={author.avatarUrl || '/images/default-avatar.png'} 
                                        alt={author.name} 
                                        fill
                                        sizes="(max-width: 768px) 96px, 96px"
                                        className="object-cover rounded-full" 
                                    />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg text-on-background mb-2">Written by {author.name}</h2>
                                    <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                                        {author.role === 'superadmin' ? 'Lead Editor and Platform Administrator' : 'Content Contributor'}
                                    </p>
                                </div>
                            </section>
                        )}
                        
                        <AdUnit 
                            placement="BLOG_BOTTOM" 
                            wrapperClassName="w-full flex justify-center py-16"
                        />
                    </article>

                    {/* Sidebar */}
                    <aside className="hidden md:block w-96 shrink-0">
                        <div className="sticky top-24 flex flex-col gap-10">
                            <TableOfContents />
                            
                            <AdUnit placement="BLOG_SIDEBAR" />
                            
                            {/* Tags */}
                            {tags.length > 0 && (
                                <nav aria-label="Article Tags">
                                    <h3 className="font-bold text-xs text-on-surface-variant uppercase tracking-widest mb-4">TAGS</h3>
                                    <ul className="flex flex-wrap gap-2">
                                        {tags.map((tag: any) => (
                                            <li key={tag.id}>
                                                <Link 
                                                    href={`/search/tag/${tag.slug}` as any}
                                                    className="px-3 py-1 bg-surface-container-low border border-outline-variant/50 hover:border-primary/50 text-xs font-medium rounded-lg text-on-surface-variant hover:text-primary transition-colors block"
                                                >
                                                    #{tag.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}

                            {/* Share Links */}
                            <ShareButtons title={blog.title} />
                        </div>
                    </aside>
                </div>

                <RelatedBlogs blogs={relatedBlogs as any} />
            </main>
        </>
    );
}
