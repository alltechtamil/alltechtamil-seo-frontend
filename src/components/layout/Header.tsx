/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';

import { envConfig } from '@/config/env.config';
import { useAuth } from '@/context/AuthContext';
import { SearchBar } from '@/components/search/SearchBar';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();

    return (
        <>
            <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant/50 shadow-sm h-16">
                <div className="flex items-center justify-between px-gutter h-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-8">
                        <Link href={"/" as any} className="font-display-lg text-xl md:text-2xl text-primary tracking-tight font-bold">
                            {envConfig.siteName}
                        </Link>
                        
                        <nav className="hidden md:flex items-center gap-6 h-full">
                            <Link href={"/" as any} className="text-primary font-bold border-b-2 border-primary h-16 flex items-center transition-colors">
                                Home
                            </Link>
                            
                            <div className="relative group h-16 flex items-center">
                                <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-medium">
                                    Categories <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                                </button>
                                {/* Simple Dropdown on hover */}
                                <div className="absolute top-16 left-0 w-48 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 flex flex-col">
                                <Link href={"/search/category/content-strategy" as any} className="px-4 py-2 hover:bg-surface-container-low text-sm text-on-surface transition-colors">Content Strategy</Link>
                                    <Link href={"/search/category/technical-seo" as any} className="px-4 py-2 hover:bg-surface-container-low text-sm text-on-surface transition-colors">Technical SEO</Link>
                                    <Link href={"/search/category/ai-automation" as any} className="px-4 py-2 hover:bg-surface-container-low text-sm text-on-surface transition-colors">AI & Automation</Link>
                                </div>
                            </div>

                            <Link href={"/blog" as any} className="text-on-surface-variant hover:text-primary transition-colors font-medium">
                                Articles
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Search Toggle (All Devices) */}
                        <button 
                            onClick={() => {
                                setIsSearchOpen(true);
                                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors" 
                            aria-label="Open search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Dashboard Link (Authenticated Admin/Editors only) */}
                        {isAuthenticated && (user?.role === 'superadmin' || user?.role === 'editor') && (
                            <Link 
                                href={"/admin/dashboard" as any}
                                className="hidden md:flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-full font-bold transition-colors shadow-sm text-sm"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors" 
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-surface-container-lowest border-b border-outline-variant/50 shadow-lg flex flex-col p-4 gap-2 animate-in slide-in-from-top-2">
                        <Link href={"/" as any} className="px-4 py-3 bg-primary/10 text-primary font-bold rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                            Home
                        </Link>
                        <div className="flex flex-col gap-1 px-4 py-2">
                            <span className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Categories</span>
                            <Link href={"/search/category/content-strategy" as any} className="py-2 text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Content Strategy</Link>
                            <Link href={"/search/category/technical-seo" as any} className="py-2 text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Technical SEO</Link>
                            <Link href={"/search/category/ai-automation" as any} className="py-2 text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>AI & Automation</Link>
                        </div>
                        <Link href={"/blog" as any} className="px-4 py-3 text-on-surface font-medium hover:bg-surface-container-low rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            Articles
                        </Link>
                        {isAuthenticated && (user?.role === 'superadmin' || user?.role === 'editor') && (
                            <Link href={"/admin/dashboard" as any} className="mt-2 px-4 py-3 bg-primary/10 text-primary font-bold rounded-xl flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* Full Screen Search Overlay */}
            <SearchBar 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </>
    );
}
