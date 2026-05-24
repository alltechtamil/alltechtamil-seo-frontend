/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { getPublicCategories } from '@/lib/fetchers/category.fetcher';

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  let categories: any[] = [];
  try {
    const res = await getPublicCategories();
    categories = res.data || [];
  } catch (error: any) {
    console.error('[PublicLayout] Failed to fetch categories:', error?.message || error);
  }

  return (
    <div className="bg-background text-on-surface font-ui-medium selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar */}
      <Header categories={categories} />

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-section-gap">
        {children}
      </main>

      {/* Footer */}
      <Footer categories={categories} />
    </div>
  );
}
