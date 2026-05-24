import React from 'react';
import Link from 'next/link';
import { BlogListItem } from '@/types/blog.types';
import { CustomImage } from '@/components/ui/CustomImage';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { getImageUrl } from '@/lib/utils/getImageUrl';

export interface RelatedBlogsProps {
    blogs: BlogListItem[];
}

export function RelatedBlogs({ blogs }: RelatedBlogsProps) {
    if (!blogs || blogs.length === 0) return null;

    return (
        <section className="w-full bg-surface-container-low py-20 border-t border-outline-variant/30 mt-20">
            <div className="max-w-7xl mx-auto px-gutter">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="font-bold text-3xl text-on-background mb-1 tracking-tight">Recommended for You</h2>
                        <p className="text-sm text-on-surface-variant">Continue your journey through our editorial archives.</p>
                    </div>
                    <Link href={ROUTES.BLOG as any} className="font-medium text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <div key={blog.id} className="group cursor-pointer">
                            <Link href={`/blog/${blog.slug}` as any} className="block">
                                <div className="overflow-hidden rounded-2xl mb-4 aspect-video relative">
                                    <CustomImage 
                                        src={getImageUrl(blog as any) as any}
                                        alt={blog.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                {(blog.category || blog.Category) && (
                                    <span className="text-[10px] text-primary font-bold mb-2 block tracking-widest uppercase">
                                        {(blog.category || blog.Category)?.name}
                                    </span>
                                )}
                                <h3 className="font-medium text-lg text-on-background group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                    {blog.title}
                               </h3>
                                <p className="text-sm text-on-surface-variant line-clamp-2">
                                    {blog.excerpt || 'Read this article to learn more about this topic.'}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
