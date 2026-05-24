import React from 'react';

export default function BlogDetailLoading() {
    return (
        <div className="w-full animate-pulse">
            {/* Top Ad Skeleton */}
            <div className="w-full flex justify-center py-8 bg-surface-container-lowest border-b border-outline-variant/30">
                <div className="w-full max-w-4xl h-[90px] bg-surface-container-high rounded-xl" />
            </div>

            <main className="w-full">
                {/* Article Header Skeleton */}
                <section className="max-w-7xl mx-auto px-gutter mt-12 mb-8 max-w-3xl">
                    {/* Breadcrumb */}
                    <div className="w-48 h-4 bg-surface-container-high rounded mb-8" />
                    
                    {/* Category Badge */}
                    <div className="w-24 h-6 bg-surface-container-high rounded-full mb-4" />
                    
                    {/* Title */}
                    <div className="w-full h-12 bg-surface-container-high rounded mb-3" />
                    <div className="w-3/4 h-12 bg-surface-container-high rounded mb-6" />
                    
                    {/* Meta */}
                    <div className="flex gap-8 py-4 border-y border-outline-variant/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-container-high rounded-full" />
                            <div className="flex flex-col gap-1">
                                <div className="w-24 h-3 bg-surface-container-high rounded" />
                                <div className="w-16 h-2 bg-surface-container-high rounded" />
                            </div>
                        </div>
                        <div className="w-24 h-5 bg-surface-container-high rounded my-auto" />
                        <div className="w-24 h-5 bg-surface-container-high rounded my-auto" />
                    </div>
                </section>

                {/* Featured Image Skeleton */}
                <div className="w-full mb-16">
                    <div className="w-full h-[400px] md:h-[600px] bg-surface-container-high" />
                </div>

                {/* Main Content & Sidebar */}
                <div className="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row gap-12 lg:gap-16 pb-20">
                    {/* Article Body Skeleton */}
                    <article className="w-full md:max-w-3xl shrink-0">
                        <div className="w-full h-[90px] bg-surface-container-high rounded-xl mb-8" />
                        
                        {/* Text Content */}
                        <div className="space-y-4 mb-8">
                            <div className="w-full h-4 bg-surface-container-high rounded" />
                            <div className="w-full h-4 bg-surface-container-high rounded" />
                            <div className="w-11/12 h-4 bg-surface-container-high rounded" />
                            <div className="w-10/12 h-4 bg-surface-container-high rounded" />
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div className="w-1/2 h-8 bg-surface-container-high rounded mb-6" />
                            <div className="w-full h-4 bg-surface-container-high rounded" />
                            <div className="w-full h-4 bg-surface-container-high rounded" />
                            <div className="w-full h-4 bg-surface-container-high rounded" />
                            <div className="w-9/12 h-4 bg-surface-container-high rounded" />
                        </div>

                        {/* Author Bio Card Skeleton */}
                        <div className="mt-20 p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 flex flex-col md:flex-row gap-8">
                            <div className="w-24 h-24 bg-surface-container-high rounded-full shrink-0" />
                            <div className="w-full pt-2 space-y-3">
                                <div className="w-48 h-6 bg-surface-container-high rounded" />
                                <div className="w-full h-4 bg-surface-container-high rounded" />
                                <div className="w-2/3 h-4 bg-surface-container-high rounded" />
                            </div>
                        </div>
                    </article>

                    {/* Sidebar Skeleton */}
                    <aside className="hidden md:block w-80 shrink-0">
                        <div className="sticky top-24 flex flex-col gap-10">
                            {/* TOC */}
                            <div className="w-full h-[300px] bg-surface-container-lowest rounded-2xl border border-outline-variant/50" />
                            
                            {/* Ad */}
                            <div className="w-full h-[250px] bg-surface-container-high rounded-xl" />
                            
                            {/* Tags */}
                            <div>
                                <div className="w-16 h-3 bg-surface-container-high rounded mb-4" />
                                <div className="flex flex-wrap gap-2">
                                    <div className="w-16 h-6 bg-surface-container-high rounded-lg" />
                                    <div className="w-24 h-6 bg-surface-container-high rounded-lg" />
                                    <div className="w-20 h-6 bg-surface-container-high rounded-lg" />
                                </div>
                            </div>

                            {/* Share Links */}
                            <div className="w-full h-[120px] bg-surface-container-lowest rounded-2xl border border-outline-variant/50" />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
