"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { envConfig } from '@/config/env.config';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Layers,
  Tag,
  LineChart,
  Megaphone,
  Bug,
  Settings,
  X,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Images', href: '/admin/media', icon: ImageIcon },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
    { name: 'Ads', href: '/admin/ads', icon: Megaphone },
    { name: 'Error Logs', href: '/admin/error-logs', icon: Bug },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('[Sidebar] Failed to logout:', error);
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-full py-6 px-4 bg-surface-container-lowest border-r border-outline-variant transition-transform duration-300 ease-in-out md:static md:translate-x-0 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="font-extrabold text-2xl text-primary tracking-tighter">
              {envConfig.siteName || 'AllTechTamil'}
            </h1>
          
          </div>
          {/* Close button on mobile viewports */}
          <button 
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg md:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Link Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if current route is active
            const isActive = item.href === '/admin/dashboard' 
              ? pathname === '/admin' || pathname === '/admin/dashboard'
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href as any}
                onClick={() => {
                  // Auto-collapse sidebar on mobile click
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-98 ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-on-surface-variant/70'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile Section */}
        <div className="mt-auto pt-4 border-t border-outline-variant/30 space-y-2">
          {/* User Profile Snippet */}
          <div className="flex items-center gap-3 px-3 py-3 bg-surface-container-low rounded-2xl border border-outline-variant/20">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-on-surface truncate text-xs">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-[10px] text-on-surface-variant opacity-80 capitalize truncate">
                {user?.role || 'editor'}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors active:scale-95"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
