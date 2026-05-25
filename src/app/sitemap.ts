import { MetadataRoute } from 'next';
import { envConfig } from '@/config/env.config';
import { getPublicBlogs } from '@/lib/fetchers/blog.fetcher';

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

    return [
        ...staticRoutes,
        ...blogRoutes,
    ];
}
