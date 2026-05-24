import { MetadataRoute } from 'next';
import { envConfig } from '@/config/env.config';
import { getPublicBlogs } from '@/lib/fetchers/blog.fetcher';
import { getPublicCategories } from '@/lib/fetchers/category.fetcher';
import { getPublicTags } from '@/lib/fetchers/tag.fetcher';

// Ensure the sitemap is always freshly generated, fetching live DB entities
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Next.js Dynamic Sitemap Generator.
 * Compiles static pages and dynamic database entities into a standard XML sitemap at /sitemap.xml.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = (envConfig.siteUrl || 'https://www.alltechtamil.in').replace(/\/$/, '');

    // Static Root & Primary Pages
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
    ];

    // 1. Dynamic Published Blogs Feed -> /blog/:slug (Priority: 0.8)
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const blogsRes = await getPublicBlogs({ page: 1, limit: 1000, status: 'published' });
        const blogs = blogsRes.data || [];
        blogRoutes = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));
    } catch (error) {
        console.error('[Sitemap] Failed to fetch blogs:', error);
    }

    // 2. Dynamic Categories -> /search/category/:slug (Priority: 0.6)
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const categoriesRes = await getPublicCategories();
        const categories = categoriesRes.data || [];
        categoryRoutes = categories.map((cat) => ({
            url: `${baseUrl}/search/category/${cat.slug}`,
            lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));
    } catch (error) {
        console.error('[Sitemap] Failed to fetch categories:', error);
    }

    // 3. Dynamic Tags -> /search/tag/:slug (Priority: 0.5)
    let tagRoutes: MetadataRoute.Sitemap = [];
    try {
        const tagsRes = await getPublicTags();
        const tags = tagsRes.data || [];
        tagRoutes = tags.map((tag) => ({
            url: `${baseUrl}/search/tag/${tag.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        }));
    } catch (error) {
        console.error('[Sitemap] Failed to fetch tags:', error);
    }

    return [
        ...staticRoutes,
        ...blogRoutes,
        ...categoryRoutes,
        ...tagRoutes,
    ];
}
