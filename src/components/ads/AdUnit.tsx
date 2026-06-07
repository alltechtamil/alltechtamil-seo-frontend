'use client';

import React, { useEffect, useRef } from 'react';
import { useAds } from '@/hooks/useAds';
import { cn } from '@/lib/utils/cn';
import type { AdPlacement } from '@/types/ad.types';

export interface AdUnitProps {
  placement: AdPlacement;
  className?: string;
  wrapperClassName?: string;
}

export function AdUnit({ placement, className, wrapperClassName }: AdUnitProps) {
  const { ads, loading, error } = useAds(placement);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      if (ads.length > 0) {
        const activeAd = ads.find(ad => ad.isActive);
        
        if (activeAd && activeAd.adScript) {
          try {
            // Clear previous content
            containerRef.current.innerHTML = '';
            
            // Inject script safely. Using createContextualFragment allows <script> tags to execute.
            const fragment = document.createRange().createContextualFragment(activeAd.adScript);
            containerRef.current.appendChild(fragment);
          } catch (e) {
            console.error(`Failed to inject ad script for placement ${placement}:`, e);
          }
        } else {
          containerRef.current.innerHTML = '';
        }
      } else {
        containerRef.current.innerHTML = '';
      }
    }
  }, [ads, placement]);

  // If we are loading or there's no active ad, and we have a fallback text,
  // render the beautiful placeholder (especially useful for dev environments)
  const hasActiveAd = ads.some(ad => ad.isActive);

  // During active loading state (before client fetch resolves),
  // we render a pulse skeleton using the exact layout dimensions (className)
  // to reserve page space and eliminate Cumulative Layout Shift (CLS).
  if (loading) {
    return (
      <div 
        className={cn(
          "w-full flex justify-center items-center bg-surface-container-low/15 animate-pulse border border-outline-variant/5 rounded-lg text-[10px] tracking-wider text-outline/25 font-mono uppercase select-none",
          className
        )}
      >
        Ad Space
      </div>
    );
  }

  // If loading is finished and there's no active ad or an error occurred,
  // collapse the space entirely to avoid leaving an empty gap on the page.
  if (error || !hasActiveAd) {
    return null;
  }

  const adContent = (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ad-unit-container iframe,
        .ad-unit-container object,
        .ad-unit-container embed,
        .ad-unit-container img {
          max-width: 100% !important;
          height: auto !important;
        }
      ` }} />
      <div 
        ref={containerRef} 
        className={cn("ad-unit-container w-full flex justify-center items-center overflow-hidden", className)} 
      />
    </>
  );

  if (wrapperClassName) {
    return (
      <div className={wrapperClassName}>
        {adContent}
      </div>
    );
  }

  return adContent;
}
