import { Metadata } from 'next';
import { envConfig } from '@/config/env.config';
import { Blog } from '@/types/blog.types';
import { getImageUrl } from './getImageUrl';
import { ogDefault } from 'public/images';

interface MetaProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    blog?: Blog;
}

export function buildMeta({
    title,
    description,
    image = ogDefault.src,
    url = envConfig.siteUrl,
    type = 'website',
    blog,
}: MetaProps): Metadata {
    const siteName = envConfig.siteName;

    // If it's a blog post, extract rich metadata
    if (blog) {
        const blogImageObj = getImageUrl(blog as any);
        const blogImage = typeof blogImageObj === 'string' ? blogImageObj : blogImageObj.src;
        const finalTitle = blog.seoTitle || blog.title;
        const finalDescription = blog.seoDescription || blog.excerpt || description;
        const tagsList = (blog.tags || (blog as any).Tags || []) as any[];

        return {
            title: finalTitle,
            description: finalDescription,
            alternates: {
                canonical: blog.canonicalUrl || `${envConfig.siteUrl}/blog/${blog.slug}`,
            },
            keywords: blog.focusKeyword ? [blog.focusKeyword, ...tagsList.map((t: any) => t.name)] : tagsList.map((t: any) => t.name),
            openGraph: {
                type: 'article',
                siteName,
                title: blog.ogTitle || finalTitle,
                description: blog.ogDescription || finalDescription,
                url: `${envConfig.siteUrl}/blog/${blog.slug}`,
                images: [
                    {
                        url: blog.ogImageUrl || blogImage,
                        width: 1200,
                        height: 630,
                        alt: blog.title,
                    },
                ],
                publishedTime: blog.publishedAt || undefined,
                modifiedTime: blog.updatedAt,
                authors: blog.author ? [blog.author.name] : undefined,
                tags: tagsList.map((t: any) => t.name),
            },
            twitter: {
                card: 'summary_large_image',
                title: blog.ogTitle || finalTitle,
                description: blog.ogDescription || finalDescription,
                images: [blog.ogImageUrl || blogImage],
            },
        };
    }

    // Default return
    return {
        title,
        description,
        metadataBase: new URL(envConfig.siteUrl),
        openGraph: {
            type,
            siteName,
            title,
            description,
            url,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}
