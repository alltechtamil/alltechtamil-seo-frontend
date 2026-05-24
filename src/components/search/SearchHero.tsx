"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SearchHeroProps {
    initialQuery?: string;
    title: string;
    subtitle?: string;
}

export function SearchHero({ initialQuery = '', title, subtitle }: SearchHeroProps) {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <header className="mb-16">
            {/* Centered Large Search Input Bar */}
            <div className="max-w-3xl mx-auto text-center mb-10">
                <form 
                    onSubmit={handleSubmit}
                    className={`relative rounded-full transition-all duration-300 bg-surface-container-lowest border border-outline-variant/60 shadow-sm ${
                        isFocused ? 'ring-2 ring-primary/20 scale-[1.01] border-primary' : 'hover:border-outline'
                    }`}
                >
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-6 h-6" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search the library..."
                        className="w-full py-5 pl-16 pr-28 bg-transparent border-none rounded-full text-lg md:text-xl font-medium text-on-surface placeholder:text-outline-variant outline-none"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/95 text-on-primary px-6 md:px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md active:scale-95"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Results Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
                <div>
                    <h1 className="font-display-lg text-3xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-on-surface-variant text-sm md:text-base font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </header>
    );
}
