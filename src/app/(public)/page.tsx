import React from 'react';
import type { BlogListItem } from '@/types/blog.types';
import type { CategorySummary } from '@/components/home/CategoriesSection';
import type { TagSummary } from '@/components/home/PopularTags';

import { AdUnit } from '@/components/ads/AdUnit';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularTags } from '@/components/home/PopularTags';
import { RecentBlogs } from '@/components/home/RecentBlogs';
import { getPublicBlogs } from '@/lib/api/public/blogs.api';
import { getPublicCategories } from '@/lib/api/public/categories.api';
import { getPublicTags } from '@/lib/api/public/tags.api';
import { buildSeoMetadata } from '@/lib/utils/seo.helper';
import { JsonLd } from '@/components/seo/JsonLd';
import { envConfig } from '@/config/env.config';

// Revalidate this page in the background every 3600 seconds (1 hour)
export const revalidate = 3600;

export const metadata = buildSeoMetadata({
    title: 'All Tech Tamil – Tamil Tech News, ChatGPT & AI Image Prompts',
    description: 'Stay ahead with All Tech Tamil: daily Tamil‑language tech news, expert ChatGPT text/image prompts, AI & ML tutorials, and gadget reviews.',
    path: '/',
});

export default async function Home() {
    let allPosts: BlogListItem[] = [];
    let totalPages = 1;
    let categories: CategorySummary[] = [];
    let tags: TagSummary[] = [];

    try {
        // Parallel data fetch
        const [blogsRes, categoriesRes, tagsRes] = await Promise.all([
            getPublicBlogs({ page: 1, limit: 10, status: 'published' }),
            getPublicCategories(),
            getPublicTags(true) // popular=true
        ]);

        allPosts = blogsRes.data || [];
        totalPages = blogsRes.meta?.totalPages || 1;
        
        categories = (categoriesRes.data || []).map(cat => ({
            name: cat.name,
            slug: cat.slug,
            count: 0 // Count might be added later by backend
        }));

        tags = (tagsRes.data || []).map(tag => ({ name: tag.name, slug: tag.slug }));
    } catch (error) {
        console.error("Failed to fetch homepage data:", error);
    }

    const featuredPost = allPosts.find(p => p.isFeatured) || allPosts[0] || null;
    const regularPosts = featuredPost ? allPosts.filter(p => p.id !== featuredPost.id) : allPosts;

    return (
        <>
            <AdUnit 
                placement="HOME_TOP" 
                className="max-w-7xl mx-auto px-gutter mb-8 w-full h-[90px] rounded-lg block" 
            />

            <div className="max-w-7xl mx-auto px-gutter">
                {/* Featured Hero Section */}
                <HeroSection featuredPost={featuredPost} />

                {/* Trending Tags Navigation */}
                <PopularTags tags={tags} />

                <AdUnit 
                    placement="HOME_MIDDLE" 
                    className="mb-12 w-full h-32 rounded-xl block" 
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Recent Blogs Feed — pagination suppressed; full listing at /blog */}
                    <RecentBlogs posts={regularPosts} currentPage={1} totalPages={1} />

                    {/* Sidebar Widgets */}
                    <aside aria-label="Secondary Sidebar" className="lg:col-span-3 flex flex-col gap-8">
                        {/* Popular Categories */}
                        <CategoriesSection categories={categories} />

                        <AdUnit 
                            placement="HOME_BOTTOM" 
                            className="rounded-xl min-h-[250px] block" 
                        />
                    </aside>
                </div>
            </div>
            <JsonLd
                type="combined"
                breadcrumbs={[
                    { position: 1, name: 'Home', item: envConfig.siteUrl || 'https://www.alltechtamil.in/' }
                ]}
                faqs={[
                    {
                        question: 'How do I use ChatGPT prompts in Tamil?',
                        answer: 'Browse our curated Tamil ChatGPT prompt library—copy & paste directly.'
                    },
                    {
                        question: 'Where can I find AI image prompts in Tamil?',
                        answer: 'Explore step‑by‑step AI image‑generation tutorials with Tamil prompts.'
                    }
                ]}
            />
        </>
    );
}
