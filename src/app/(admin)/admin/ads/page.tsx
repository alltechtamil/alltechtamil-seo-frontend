import { Metadata } from 'next';
import { AdManager } from '@/components/admin/AdManager';

export const metadata: Metadata = {
  title: 'Ad Inventory | Admin Dashboard',
  description: 'Manage banners, injected scripts, and ad placements across the site.',
};

export default function AdminAdsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <header>
        <h1 className="text-3xl font-black text-on-background tracking-tight">Ad Inventory</h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
          Deploy and monitor responsive ad units. Scripts injected here are rendered dangerously on public pages, so ensure your code snippets are valid HTML/JS.
        </p>
      </header>

      <section>
        <AdManager />
      </section>
    </div>
  );
}
