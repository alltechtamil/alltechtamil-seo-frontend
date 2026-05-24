/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { envConfig } from '@/config/env.config';
import { Header } from './Header';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-surface font-ui-medium selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      {/* TopNavBar */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-section-gap">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
