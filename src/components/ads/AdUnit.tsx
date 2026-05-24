'use client';

import React, { useEffect, useRef } from 'react';
import { useAds } from '@/hooks/useAds';
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
    if (ads.length > 0 && containerRef.current) {
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
      }
    }
  }, [ads, placement]);

  // If we are loading or there's no active ad, and we have a fallback text,
  // render the beautiful placeholder (especially useful for dev environments)
  const hasActiveAd = ads.some(ad => ad.isActive);

  if (loading || error || !hasActiveAd) {
    return null;
  }

  const adContent = <div ref={containerRef} className={className} />;

  if (wrapperClassName) {
    return (
      <div className={wrapperClassName}>
        {adContent}
      </div>
    );
  }

  return adContent;
}
