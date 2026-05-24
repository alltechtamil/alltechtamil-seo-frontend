import React from 'react';
import { User } from '@/types/user.types';
import { formatDate } from '@/lib/utils/formatDate';
import { Calendar, Clock } from 'lucide-react';
import { CustomImage } from '@/components/ui/CustomImage';

interface BlogMetaProps {
    author?: Pick<User, "id" | "name" | "email" | "avatarUrl" | "role">;
    publishedAt: string | null;
    readTimeMinutes: number;
}

export function BlogMeta({ author, publishedAt, readTimeMinutes }: BlogMetaProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 py-4 border-y border-outline-variant/30 text-on-surface-variant">
            {author && (
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <CustomImage 
                            src={author.avatarUrl || '/images/default-avatar.png'} 
                            alt={author.name} 
                            fill
                            priority
                            sizes="40px"
                            className="object-cover" 
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-on-background">{author.name}</span>
                        <span className="text-xs text-on-surface-variant capitalize">{author.role || 'Author'}</span>
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-6 sm:gap-8">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm">{publishedAt ? formatDate(publishedAt) : 'Draft'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm">{readTimeMinutes} min read</span>
                </div>
            </div>
        </div>
    );
}
