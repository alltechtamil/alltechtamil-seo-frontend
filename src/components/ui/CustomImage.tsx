"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface CustomImageProps extends ImageProps {
    /** Additional classes for the container `div` wrapper */
    containerClassName?: string;
    /** Additional classes for the skeleton overlay (useful for rounding corners) */
    skeletonClassName?: string;
    /** Disable the skeleton loading effect if not needed */
    disableSkeleton?: boolean;
}

/**
 * A highly flexible, centralized image component wrapping `next/image`.
 * Features a built-in skeleton loader that gracefully fades out when the image fully loads.
 *
 * Handles the edge case where cached images do not re-trigger `onLoad`,
 * by inspecting the native element's `.complete` property on mount.
 */
export function CustomImage({
    src,
    alt,
    className,
    containerClassName,
    skeletonClassName,
    disableSkeleton = false,
    onLoad,
    ...props
}: CustomImageProps) {
    const [isLoading, setIsLoading] = useState(!disableSkeleton);
    const imgRef = useRef<HTMLImageElement>(null);

    /**
     * On mount, check if the browser already has the image in its cache.
     * If so, the native `complete` property is `true` immediately and we
     * must manually dismiss the skeleton — `onLoad` will NOT fire again.
     */
    useEffect(() => {
        if (disableSkeleton) return;
        const img = imgRef.current;
        if (img?.complete) {
            setIsLoading(false);
        }
    }, [disableSkeleton]);

    if (disableSkeleton) {
        return (
            <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
                <Image
                    src={src}
                    alt={alt}
                    className={className}
                    onLoad={onLoad}
                    {...props}
                />
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
            {/* Skeleton Loader Overlay — fades out once image is ready */}
            {isLoading && (
                <div
                    className={cn(
                        "absolute inset-0 z-10 bg-surface-container-high animate-pulse",
                        skeletonClassName
                    )}
                    aria-hidden="true"
                />
            )}

            {/* Actual Next.js Image */}
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                className={cn(
                    "transition-opacity duration-300 ease-in-out",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
                onLoad={(e) => {
                    setIsLoading(false);
                    if (onLoad) onLoad(e);
                }}
                onError={() => {
                    // If image fails to load, remove the skeleton immediately
                    // so we don't show a stuck pulsing state forever
                    setIsLoading(false);
                }}
                {...props}
            />
        </div>
    );
}
