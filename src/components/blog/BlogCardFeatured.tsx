import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { CustomImage } from '@/components/ui/CustomImage';
import { Sparkles } from 'lucide-react';
import type { BlogListItem } from '@/types/blog.types';
import { getImageUrl } from '@/lib/utils/getImageUrl';
import { formatDate } from '@/lib/utils/formatDate';
import { formatReadTime } from '@/lib/utils/formatReadTime';
import { truncateText } from '@/lib/utils/truncateText';

export interface BlogCardFeaturedProps {
    post: BlogListItem;
}

export function BlogCardFeatured({ post }: BlogCardFeaturedProps) {
    const { 
        title, 
        slug, 
        excerpt, 
        category, 
        publishedAt, 
        readTimeMinutes,
        author
    } = post;

    const href = `/blog/${slug}`;
    const categoryName = category?.name || 'Post';
    const imageSrc = getImageUrl(post);
    const readTime = formatReadTime(readTimeMinutes);
    const dateDisplay = formatDate(publishedAt);

    const authorRole = author?.role ? author.role.charAt(0).toUpperCase() + author.role.slice(1) : 'Author';
    const authorName = author?.name || 'Unknown Author';

    return (
        <Link href={href as Route} className="block mb-12 group" title={`Read ${title}`}>
            <article className="relative h-[480px] xs:h-[520px] sm:h-[450px] md:h-[500px] lg:h-[460px] w-full rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CustomImage fill priority alt={title}
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    containerClassName="absolute inset-0"
                    src={imageSrc} />
                
                {/* Premium heavy gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-6 sm:p-8 md:p-14 text-white opacity-95 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex flex-col gap-3 sm:gap-5 max-w-[800px] relative z-10 translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest shadow-sm w-fit border border-white/20">
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Featured {categoryName}
                        </span>
                        
                        <h1 className="font-display-lg text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                            {title}
                        </h1>
                        
                        <p className="text-sm sm:text-lg md:text-xl text-white/80 font-medium line-clamp-2 max-w-3xl leading-relaxed">
                            {truncateText(excerpt, 150)}
                        </p>
                        
                        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                            {author?.avatarUrl ? (
                                <CustomImage width={40} height={40} alt={authorName} 
                                    className="rounded-full object-cover"
                                    containerClassName="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full border-2 border-white/30 shadow-md"
                                    skeletonClassName="rounded-full"
                                    src={author.avatarUrl} />
                            ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-lg">
                                    {authorName.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="text-xs sm:text-sm">
                                <p className="font-bold text-white text-sm sm:text-base">{authorName}</p>
                                <p className="text-white/60 font-medium tracking-wide">
                                    {authorRole} • {dateDisplay} • {readTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
