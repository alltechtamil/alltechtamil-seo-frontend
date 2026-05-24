import React from 'react';
import { envConfig } from '@/config/env.config';
import { favicon } from '../../../public/images';
import { SEO_CONSTANTS } from '@/constants/seo.constants';

export type BreadcrumbItem = {
    position: number;
    name: string;
    item: string;
};

export type FaqItem = {
    question: string;
    answer: string;
};

export interface JsonLdProps {
    // Original interface for backward compatibility
    data?: Record<string, unknown> | Record<string, unknown>[];
    // Reusable builder properties
    type?: 'website' | 'organization' | 'breadcrumb' | 'faq' | 'combined';
    siteName?: string;
    siteUrl?: string;
    description?: string;
    logoUrl?: string;
    sameAs?: string[];
    breadcrumbs?: BreadcrumbItem[];
    faqs?: FaqItem[];
    // Fallback graph payload for full manual override
    customGraph?: any[];
}

/**
 * Premium reusable React Component to embed JSON-LD schemas in Next.js App Router.
 * Highly modular and customizable for all SEO requirements.
 */
export function JsonLd({
    data,
    type,
    siteName = 'All Tech Tamil',
    siteUrl = envConfig.siteUrl || 'https://www.alltechtamil.in/',
    description = SEO_CONSTANTS.defaultDescription,
    logoUrl = favicon.src,
    sameAs = SEO_CONSTANTS.sameAs,
    breadcrumbs = [],
    faqs = [],
    customGraph
}: JsonLdProps) {
    if (data) {
        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
            />
        );
    }
    if (customGraph) {
        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": customGraph
                    })
                }}
            />
        );
    }

    const baseSiteUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
    const graph: any[] = [];

    // 1. WebSite Schema
    if (type === 'website' || type === 'combined') {
        graph.push({
            "@type": "WebSite",
            "@id": `${baseSiteUrl}#website`,
            "url": baseSiteUrl,
            "name": siteName,
            "description": description,
            "publisher": { "@id": `${baseSiteUrl}#org` },
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${baseSiteUrl}search?q={search_term}`,
                "query-input": "required name=search_term"
            }
        });
    }

    // 2. Organization Schema
    if (type === 'organization' || type === 'combined') {
        const absoluteLogoUrl = logoUrl.startsWith('http')
            ? logoUrl
            : `${baseSiteUrl}${logoUrl.startsWith('/') ? logoUrl.slice(1) : logoUrl}`;

        graph.push({
            "@type": "Organization",
            "@id": `${baseSiteUrl}#org`,
            "name": siteName,
            "url": baseSiteUrl,
            "logo": {
                "@type": "ImageObject",
                "url": absoluteLogoUrl
            },
            "sameAs": sameAs
        });
    }

    // 3. BreadcrumbList Schema
    if ((type === 'breadcrumb' || type === 'combined') && breadcrumbs.length > 0) {
        graph.push({
            "@type": "BreadcrumbList",
            "@id": `${baseSiteUrl}#breadcrumb`,
            "itemListElement": breadcrumbs.map(b => ({
                "@type": "ListItem",
                "position": b.position,
                "name": b.name,
                "item": b.item
            }))
        });
    }

    // 4. WebPage Schema (Standard metadata context)
    if (type === 'combined') {
        graph.push({
            "@type": "WebPage",
            "@id": `${baseSiteUrl}#webpage`,
            "url": baseSiteUrl,
            "name": `${siteName} Home`,
            "isPartOf": { "@id": `${baseSiteUrl}#website` },
            "breadcrumb": breadcrumbs.length > 0 ? { "@id": `${baseSiteUrl}#breadcrumb` } : undefined
        });
    }

    // 5. FAQPage Schema
    if ((type === 'faq' || type === 'combined') && faqs.length > 0) {
        graph.push({
            "@type": "FAQPage",
            "@id": `${baseSiteUrl}#faq`,
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        });
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": graph
                })
            }}
        />
    );
}
