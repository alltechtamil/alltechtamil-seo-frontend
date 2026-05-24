'use client';

import { useEffect } from 'react';
import { envConfig } from '@/config/env.config';

export function ViewTracker({ blogId }: { blogId: string }) {
    useEffect(() => {
        const startTime = Date.now();
        let hasFired = false;

        const handleUnload = () => {
            if (hasFired) return;
            hasFired = true;

            const readTimeSec = Math.floor((Date.now() - startTime) / 1000);
            const isBounce = readTimeSec < 30;

            // Use sendBeacon for guaranteed delivery even if the tab is closed
            if (navigator.sendBeacon) {
                const url = `${envConfig.apiUrl}/api/v1/public/analytics/track/view`;
                const payload = JSON.stringify({ blogId, readTimeSec, isBounce });
                const blob = new Blob([payload], { type: 'application/json' });
                navigator.sendBeacon(url, blob);
            }
        };

        // pagehide is the most reliable event for tab/browser close
        window.addEventListener('pagehide', handleUnload);

        return () => {
            window.removeEventListener('pagehide', handleUnload);
            // Also fire on React unmount (client-side NextJS navigation)
            handleUnload();
        };
    }, [blogId]);

    return null; // Component does not render anything
}
