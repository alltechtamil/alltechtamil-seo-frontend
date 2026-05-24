import React from 'react';
import { cn } from '@/components/ui/Button';

interface AdvertisementProps {
    className?: string;
    text: string;
}

export function Advertisement({ className, text }: AdvertisementProps) {
    return (
        <div aria-hidden="true"
            className={cn("bg-surface-container-low border border-outline-variant flex flex-col items-center justify-center", className)}>
            <span className="text-[10px] text-outline uppercase tracking-widest font-bold mb-1">Advertisement</span>
            <div className="text-outline-variant text-sm italic text-center">{text}</div>
        </div>
    );
}
