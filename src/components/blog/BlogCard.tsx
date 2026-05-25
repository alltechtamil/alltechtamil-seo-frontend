import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { CustomImage } from '@/components/ui/CustomImage';
import { Clock, CalendarDays, BookOpen, ArrowRight } from 'lucide-react';
import type { BlogListItem } from '@/types/blog.types';
import { getImageUrl } from '@/lib/utils/getImageUrl';
import { formatDate } from '@/lib/utils/formatDate';
import { formatReadTime } from '@/lib/utils/formatReadTime';
import { truncateText } from '@/lib/utils/truncateText';

export interface BlogCardProps {
    post: BlogListItem;
}

export function BlogCard({ post }: BlogCardProps) {
    const { 
        title, 
        slug, 
        excerpt, 
        category, 
        publishedAt, 
        readTimeMinutes
    } = post;

    const href = `/blog/${slug}`;
    const categoryName = category?.name || 'Blog';
    const imageSrc = getImageUrl(post);
    const readTime = formatReadTime(readTimeMinutes);
    const dateDisplay = formatDate(publishedAt);
    const dateIso = publishedAt ? new Date(publishedAt).toISOString().split('T')[0] : '';

    return (
        <Link href={href as Route} className="block h-full group" title={`Read ${title}`}>
            <article
                className="h-full bg-surface-container-lowest rounded-2xl border border-outline-variant/60 overflow-hidden flex flex-col group/card hover:border-outline hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 relative">
                
                {/* Accent Top Bar Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left z-20" />

                {/* Image Container with CustomImage */}
                <div className="relative w-full h-[280px] overflow-hidden bg-surface-container-low">
                    <CustomImage 
                        fill
                        src={imageSrc} 
                        alt={title}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                        containerClassName="absolute inset-0"
                    />
                    
                    {/* Shadow gradient overlay for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-white/95 backdrop-blur-md text-primary px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm border border-white/20">
                            {categoryName}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    {/* Meta Top Section */}
                    <div className="flex items-center gap-3 text-[11px] font-bold text-outline tracking-wider uppercase mb-4">
                        {dateIso && (
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5" />
                                <time dateTime={dateIso}>{dateDisplay}</time>
                            </div>
                        )}
                        {dateIso && <span className="w-1 h-1 rounded-full bg-outline-variant" />}
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{readTime}</span>
                        </div>
                    </div>

                    <h3 className="font-display-lg text-xl mb-3 leading-snug group-hover/card:text-primary transition-colors line-clamp-2">
                        {post.author?.avatarUrl ? (
                            <CustomImage 
                                width={32} 
                                height={32} 
                                src={post.author.avatarUrl} 
                                alt={post.author.name || 'Author avatar'}
                                className="rounded-full object-cover"
                                containerClassName="w-8 h-8 rounded-full border border-outline-variant/30 flex-shrink-0 inline-block mr-2 align-middle"
                                skeletonClassName="rounded-full"
                            />
                        ) : null}
                        {title}
                    </h3>
                    
                    <p className="text-on-surface-variant text-sm line-clamp-3 mb-6 leading-relaxed">
                        {truncateText(excerpt, 120)}
                    </p>

                    <footer className="mt-auto pt-5 border-t border-outline-variant/40">
                        <div className="w-full py-2.5 px-4 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-between group-hover/card:bg-primary group-hover/card:border-primary group-hover/card:text-on-primary transition-all duration-300">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span className="font-bold text-sm">Read More</span>
                            </div>
                            <ArrowRight className="w-4 h-4 group-hover/card:translate-x-1 transition-transform duration-300" />
                        </div>
                    </footer>
                </div>
            </article>
        </Link>
    );
}
