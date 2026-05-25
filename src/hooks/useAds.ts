import { useState, useEffect } from 'react';
import { getPublicAds } from '@/lib/api/public/ads.api';
import type { AdPlacement, AdUnit, DeviceTarget } from '@/types/ad.types';

export function useAds(placement: AdPlacement) {
  const [ads, setAds] = useState<AdUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deviceTarget, setDeviceTarget] = useState<DeviceTarget>('desktop');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const target: DeviceTarget = isMobile ? 'mobile' : 'desktop';
      setDeviceTarget(target);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchAds() {
      try {
        setLoading(true);
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
  }, [placement, deviceTarget]);

  return { ads, loading, error };
}
