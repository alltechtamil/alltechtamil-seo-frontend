"use client";

import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export interface SearchFiltersProps {
    sortBy?: 'relevance' | 'date';
    onSortChange?: (sort: 'relevance' | 'date') => void;
    totalResults?: number;
}

export function SearchFilters({ 
    sortBy = 'relevance', 
    onSortChange,
    totalResults = 0
}: SearchFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-outline-variant/20">
            <div className="text-sm text-on-surface-variant font-medium">
                Showing <span className="font-bold text-on-surface">{totalResults}</span> articles found
            </div>
            
            <div className="flex items-center gap-3">
                {/* Filter Trigger Button */}
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-outline-variant/60 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-xs font-bold text-on-surface"
                >
                    <SlidersHorizontal className="w-4 h-4 text-outline" />
                    <span>Filter</span>
                </button>

                {/* Sort Toggle Button */}
                <button
                    type="button"
                    onClick={() => onSortChange?.(sortBy === 'relevance' ? 'date' : 'relevance')}
                    className="flex items-center gap-2 px-4 py-2 border border-outline-variant/60 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-xs font-bold text-on-surface"
                >
                    <ArrowUpDown className="w-4 h-4 text-outline" />
                    <span>Sort: {sortBy === 'relevance' ? 'Relevance' : 'Newest'}</span>
                </button>
            </div>
        </div>
    );
}
