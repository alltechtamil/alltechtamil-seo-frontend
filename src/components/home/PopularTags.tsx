import React from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export interface TagSummary {
    name: string;
    slug: string;
}

export interface PopularTagsProps {
    tags?: TagSummary[];
}

export function PopularTags({ tags = [] }: PopularTagsProps) {
    // Fallback data if none provided
    const displayTags: TagSummary[] = tags.length > 0 ? tags : [
        { name: 'AI', slug: 'ai' },
        { name: 'Content Strategy', slug: 'content-strategy' },
        { name: 'Technical SEO', slug: 'technical-seo' },
        { name: 'Growth Hacking', slug: 'growth-hacking' },
    ];

    return (
        <nav aria-label="Trending Topics" className="flex items-center justify-between gap-3 mb-16 pb-6 border-b border-outline-variant/40 w-full overflow-hidden">
            <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
            
            <div className="flex items-center gap-2 mr-3 text-on-surface flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest m-0">Trending</h2>
            </div>
            
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 -mb-1 flex-1 flex-nowrap md:flex-wrap">
                {displayTags.map((tag) => (
                    <Link
                        key={tag.slug}
                        className="px-5 py-2 bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/50 hover:bg-primary/5 text-on-surface hover:text-primary rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0"
                        href={`/search/tag/${tag.slug}` as any}
                        title={`Browse articles tagged with #${tag.name}`}
                    >
                        #{tag.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
