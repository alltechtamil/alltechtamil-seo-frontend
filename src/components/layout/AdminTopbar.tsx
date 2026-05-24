"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Menu, 
  Bell, 
  ExternalLink, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Translate pathname to high-end human-readable page titles
  const getPageTitle = (path: string | null) => {
    if (!path) return 'Control Center';
    if (path === '/admin') return 'Dashboard Overview';
    if (path.startsWith('/admin/blogs')) return 'Content Engineering';
    if (path.startsWith('/admin/media')) return 'Media Library';
    if (path.startsWith('/admin/categories')) return 'Taxonomy Categories';
    if (path.startsWith('/admin/tags')) return 'Taxonomy Tags';
    if (path.startsWith('/admin/analytics')) return 'Performance Analytics';
    if (path.startsWith('/admin/ads')) return 'Ad Monetization';
    if (path.startsWith('/admin/error-logs')) return 'System Diagnostics';
    if (path.startsWith('/admin/settings')) return 'CMS Settings';
    return 'Admin Panel';
  };

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('[AdminTopbar] Logout failed:', error);
    }
  };

  return (
    <header className="h-16 flex justify-between items-center px-6 w-full bg-surface-container-lowest border-b border-outline-variant z-40 shrink-0 select-none">
      
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-lg text-on-surface tracking-tight truncate max-w-[180px] sm:max-w-none">
          {getPageTitle(pathname)}
        </h2>
      </div>

      {/* Right side: Bell, Platform Link, User Avatar Dropdown */}
      <div className="flex items-center gap-3">

        {/* Live Site Link */}
        <a 
          href="/" 
          target="_blank" 
          rel="noreferrer" 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-primary bg-primary/5 active:scale-95"
          title="Visit Public Website"
        >
          <ExternalLink className="w-5 h-5" />
        </a>

        {/* Profile Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 rounded-full transition-all active:scale-98"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant/80 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Premium Dropdown Modal */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container border border-outline-variant rounded-2xl shadow-xl z-50 py-2 animate-[slideDown_0.2s_ease-out]">
              {/* User Meta header */}
              <div className="px-4 py-2 border-b border-outline-variant/30">
                <p className="font-bold text-sm text-on-surface truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-on-surface-variant/85 truncate lowercase">
                  {user?.role || 'editor'}
                </p>
              </div>

              {/* Logout Separator */}
              <div className="border-t border-outline-variant/30 mt-1.5 p-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-error hover:bg-error/10 rounded-xl transition-all font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
