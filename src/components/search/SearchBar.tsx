"use client";

import React, { useEffect, useRef, useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-lodash-debounce';

interface SearchBarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    // Use the requested debounce hook
    const debouncedValue = useDebounce(value, 800);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            setValue('');
            setIsSearching(false);
        }
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Handle debounced search effect
    useEffect(() => {
        if (debouncedValue) {
            setIsSearching(true);
            
            // In a real implementation, you would fetch live search results here.
            // For now, we simulate a slight delay and then navigate to the results page.
            const timer = setTimeout(() => {
                router.push(`/search?q=${encodeURIComponent(debouncedValue)}` as any);
                onClose();
                setIsSearching(false);
            }, 300);
            
            return () => clearTimeout(timer);
        } else {
            setIsSearching(false);
        }
    }, [debouncedValue, router, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#121316]/95 backdrop-blur-sm animate-in fade-in duration-200 flex flex-col">
            <div className="flex justify-end p-6 md:p-8">
                <button 
                    onClick={onClose}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Close search"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-start pt-[15vh] px-4 md:px-6 pb-32">
                <form 
                    action="/search"
                    className="w-full max-w-2xl relative flex items-center bg-[#1a1b1e] border border-white/10 rounded-full p-2 shadow-2xl focus-within:border-[#3b82f6]/50 transition-colors" 
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (value.trim()) {
                            router.push(`/search?q=${encodeURIComponent(value.trim())}` as any);
                            onClose();
                        }
                    }}
                >
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                        ref={inputRef}
                        name="q"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-transparent text-white placeholder:text-white/40 text-base md:text-xl pl-14 pr-16 py-2 outline-none"
                        placeholder="Search anything..." 
                        type="text" 
                        autoFocus
                    />
                    
                    {isSearching && (
                        <div className="absolute right-36 md:right-44 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-5 h-5 text-[#3b82f6] animate-spin" />
                        </div>
                    )}

                    <button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 md:px-10 py-3 md:py-3.5 rounded-full font-bold transition-colors shadow-lg active:scale-95 ml-2">
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
}
