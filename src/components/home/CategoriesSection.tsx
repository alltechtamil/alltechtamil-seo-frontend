import React from 'react';
import Link from 'next/link';
import { FolderOpen, ChevronRight } from 'lucide-react';

export interface CategorySummary {
    name: string;
    count: number;
    slug: string;
}

export interface CategoriesSectionProps {
    categories?: CategorySummary[];
}

export function CategoriesSection({ categories = [] }: CategoriesSectionProps) {
    // Fallback data if none provided, useful for initial layout before DB connection
    const displayCategories = categories.length > 0 ? categories : [
        { name: 'Content Strategy', count: 24, slug: 'content-strategy' },
        { name: 'AI & Automation', count: 18, slug: 'ai-automation' },
        { name: 'Technical SEO', count: 12, slug: 'technical-seo' },
        { name: 'Backlink Analysis', count: 9, slug: 'backlink-analysis' }
    ];

    return (
        <section aria-labelledby="popular-categories-title" className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary" />
            <div className="flex items-center gap-2 mb-6">
                <FolderOpen className="w-5 h-5 text-secondary" />
                <h3 id="popular-categories-title" className="text-sm font-extrabold text-on-surface uppercase tracking-widest m-0">Popular Categories</h3>
            </div>

            <div className="flex flex-col gap-1">
                {displayCategories.map(cat => (
                    <Link key={cat.name} className="flex items-center justify-between group p-3 hover:bg-surface-container-low rounded-xl transition-all border border-transparent hover:border-outline-variant/50"
                        href={`/search/category/${cat.slug}` as any}
                        title={`View all articles in ${cat.name}`}>
                        <div className="flex items-center gap-3">
                            <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
                            <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">{cat.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant bg-surface-variant/30 px-2.5 py-1 rounded-md" aria-label={`${cat.count} articles`}>{cat.count}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
