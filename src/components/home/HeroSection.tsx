import React from 'react';
import { BlogCardFeatured } from '@/components/blog/BlogCardFeatured';
import type { BlogListItem } from '@/types/blog.types';

export interface HeroSectionProps {
    featuredPost: BlogListItem | null;
}

export function HeroSection({ featuredPost }: HeroSectionProps) {
    if (!featuredPost) return null;

    return (
        <section aria-label="Featured Article">
            <BlogCardFeatured post={featuredPost} />
        </section>
    );
}
