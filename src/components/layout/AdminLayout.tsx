"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';
import { AdminTopbar } from './AdminTopbar';

/**
 * Premium AdminLayout Orchestrator.
 * Handles client-side authentication guards, dynamic page loaders,
 * and coordinates the responsive navigation sidebar and topbar wrappers.
 */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Client-Side Auth Guard: redirect to login if session resolves as unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Premium, user-friendly loading skeleton displayed while checking session credentials
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="relative flex flex-col items-center gap-4 select-none">
          {/* Ambient blurred glow sphere */}
          <div className="absolute w-24 h-24 bg-primary/10 rounded-full blur-xl scale-125 animate-pulse" />
          
          {/* Custom HSL circular spinner */}
          <div className="w-10 h-10 rounded-full border-[3px] border-outline-variant/60 border-t-primary animate-spin z-10" />
          
          <div className="flex flex-col items-center text-center mt-2 z-10">
            <h3 className="font-extrabold text-sm sm:text-base text-on-surface tracking-tight">
              Verifying Authority
            </h3>
            <p className="text-[11px] text-on-surface-variant/80 mt-0.5">
              Securing editor session details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prevent flash of admin screens before redirect completes
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-surface text-on-surface font-ui-sm antialiased overflow-hidden h-screen flex">
      {/* Sidebar Drawer Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Administrative viewport */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        
        {/* Top bar control element */}
        <AdminTopbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Scrollable administrative workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-surface-container-lowest/30">
          {children}
        </div>
      </main>
    </div>
  );
}

