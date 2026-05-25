import { Metadata } from 'next';
import { envConfig } from '@/config/env.config';
import { ogDefault } from '../../../public/images';
import { SEO_CONSTANTS } from '@/constants/seo.constants';

interface SeoHelperProps {
    title: string;
    description: string;
    path: string; // e.g. "/search" or "/search/category/technology" or "" for home
    keywords?: string[];
    image?: string;
    type?: 'website' | 'article';
    index?: boolean;
    verificationCode?: string;
    locale?: string;
    alternateLocales?: string[];
}

/**
 * Premium centralized helper to build Next.js Metadata objects with maximum SEO performance.
 * Combines standard, alternates, hreflang, OpenGraph, Twitter, and robots settings.
 */
export function buildSeoMetadata({
    title,
    description,
    path,
    keywords = SEO_CONSTANTS.defaultKeywords,
    image,
    type = 'website',
    index = true,
    verificationCode = SEO_CONSTANTS.googleSiteVerification,
    locale = 'ta_IN',
    alternateLocales = ['en_US']
}: SeoHelperProps): Metadata {
    const siteUrl = envConfig.siteUrl !== 'http://localhost:3000' && envConfig.siteUrl ? envConfig.siteUrl : 'https://alltechtamil.in/';
    // Clean absolute canonical url
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const canonicalUrl = `${siteUrl.replace(/\/$/, '')}${cleanPath === '/' ? '' : cleanPath}`;
    
    // Default image url fallback
    const finalImageUrl = image || ogDefault.src;

    return {
        title,
        description,
        verification: verificationCode ? {
            google: verificationCode,
        } : undefined,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'ta-IN': canonicalUrl,
                'en-US': canonicalUrl,
            },
        },
        openGraph: {
            type,
            locale,
            alternateLocale: alternateLocales,
            siteName: 'All Tech Tamil',
            title,
            description,
            url: canonicalUrl,
            images: [
                {
                    url: finalImageUrl,
                    width: ogDefault.width || 1200,
                    height: ogDefault.height || 630,
                    alt: title,
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            site: '@all_tech_tamil',
            creator: '@all_tech_tamil',
            title,
            description,
            images: [finalImageUrl],
        },
        robots: {
            index,
            follow: true,
            nocache: true,
            googleBot: {
                index,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        }
    };
}
