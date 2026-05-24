import { useState, useEffect } from 'react';
import { getPublicAds } from '@/lib/api/public/ads.api';
import type { AdPlacement, AdUnit, DeviceTarget } from '@/types/ad.types';

export function useAds(placement: AdPlacement) {
  const [ads, setAds] = useState<AdUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAds() {
      try {
        setLoading(true);
        // Device detection based on spec
        const isMobile = window.innerWidth < 768;
        const deviceTarget: DeviceTarget = isMobile ? 'mobile' : 'desktop';

        const response = await getPublicAds(placement, deviceTarget);
        
        if (mounted) {
          setAds(response.data || []);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err);
          setAds([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAds();

    return () => {
      mounted = false;
    };
  }, [placement]);

  return { ads, loading, error };
}
