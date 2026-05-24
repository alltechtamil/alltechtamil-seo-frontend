import { Metadata } from 'next';
import { TagManager } from '@/components/admin/TagManager';

export const metadata: Metadata = {
  title: 'Tag Taxonomy | Admin Dashboard',
  description: 'Manage granular keywords and metadata tags for editorial content.',
};

export default function AdminTagsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <header>
        <h1 className="text-3xl font-black text-on-background tracking-tight">Tags</h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
          Granular taxonomy management. Tags are typically created on-the-fly while writing blogs, but you can manually pre-define or clean up keywords here.
        </p>
      </header>

      <section>
        <TagManager />
      </section>
    </div>
  );
}
