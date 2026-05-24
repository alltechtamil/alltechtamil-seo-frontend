import { Metadata } from 'next';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const metadata: Metadata = {
  title: 'Category Taxonomy | Admin Dashboard',
  description: 'Manage high-level content categories and routing for the editorial platform.',
};

export default function AdminCategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <header>
        <h1 className="text-3xl font-black text-on-background tracking-tight">Categories</h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
          Content architecture and taxonomies. Changes here directly affect public site navigation, URL structures, and blog post metadata.
        </p>
      </header>

      <section>
        <CategoryManager />
      </section>
    </div>
  );
}
