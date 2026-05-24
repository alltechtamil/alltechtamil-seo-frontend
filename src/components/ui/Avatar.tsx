"use client";

/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { cn } from './Button';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, size = 'md', className, ...props }, ref) => {
    
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg'
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary/10 text-primary font-bold uppercase",
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt || "Avatar"} 
            className="w-full h-full object-cover relative z-10"
            onError={(e) => {
              // Hide image if it fails to load to show fallback
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        
        {/* Fallback is visible if src is missing or image fails to load */}
        <span className="absolute inset-0 flex items-center justify-center z-0">
          {getInitials(fallback)}
        </span>
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
