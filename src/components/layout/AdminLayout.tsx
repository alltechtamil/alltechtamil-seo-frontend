/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { envConfig } from '@/config/env.config';
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
  Menu,
  Bell,
  ExternalLink
} from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface text-on-surface font-ui-sm antialiased overflow-hidden h-screen flex">
      {/* SideNavBar Shell */}
      <aside className="hidden md:flex flex-col h-full py-stack-md px-4 gap-stack-sm bg-surface-container-lowest border-r border-outline-variant w-64 shrink-0 z-50">
        <div className="mb-stack-lg px-2">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tighter">
            {envConfig.siteName}
          </h1>
          <div className="mt-2">
            <p className="font-ui-medium text-primary text-[14px]">
              Editorial Admin
            </p>
            <p className="text-on-surface-variant text-[11px] opacity-70">
              Premium CMS v2.4
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <Link
            href={"/admin" as any}
            className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg font-ui-medium transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href={"/admin/blogs" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <FileText className="w-5 h-5" />
            <span>Blogs</span>
          </Link>
          <Link
            href={"/admin/media" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <ImageIcon className="w-5 h-5" />
            <span>Images</span>
          </Link>
          <Link
            href={"/admin/categories" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <Layers className="w-5 h-5" />
            <span>Categories</span>
          </Link>
          <Link
            href={"/admin/tags" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <Tag className="w-5 h-5" />
            <span>Tags</span>
          </Link>
          <Link
            href={"/admin/analytics" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <LineChart className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
          <Link
            href={"/admin/ads" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <Megaphone className="w-5 h-5" />
            <span>Ads</span>
          </Link>
          <Link
            href={"/admin/error-logs" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <Bug className="w-5 h-5" />
            <span>Error Logs</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-outline-variant/30 space-y-1">

          <Link
            href={"/admin/settings" as any}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg font-ui-medium transition-all"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          {/* User Profile Snippet */}
          <div className="flex items-center gap-3 px-2 py-3 mt-2 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-ui-medium text-on-surface truncate text-sm">
                Admin User
              </p>
              <button className="text-[11px] text-primary hover:underline font-ui-medium mt-0.5">
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Top Navigation */}
        <header className="h-16 flex justify-between items-center px-gutter w-full bg-surface-container-lowest border-b border-outline-variant z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-primary bg-primary/5">
              <ExternalLink className="w-6 h-6" />
            </a>
          </div>
        </header>

        {/* Scrollable Content Region */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
