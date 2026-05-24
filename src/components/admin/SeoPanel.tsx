"use client";

import React, { useState } from 'react';
import { Search, Share2, AlertCircle, HelpCircle } from 'lucide-react';

export interface SeoData {
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
}

interface SeoPanelProps {
  data: SeoData;
  onChange: (field: keyof SeoData, value: string) => void;
  errors?: Partial<Record<keyof SeoData, string>>;
}

export function SeoPanel({ data, onChange, errors = {} }: SeoPanelProps) {
  // Tabs for switching between Meta (Google) and OpenGraph (Facebook/Twitter)
  const [activeTab, setActiveTab] = useState<'meta' | 'og'>('meta');

  // Destructure safe fallbacks
  const seoTitle = data.seoTitle || '';
  const seoDesc = data.seoDescription || '';
  const focusKey = data.focusKeyword || '';
  const canonical = data.canonicalUrl || '';
  const ogTitle = data.ogTitle || '';
  const ogDesc = data.ogDescription || '';

  // Standard Limits
  const LIMITS = {
    seoTitle: 60,
    seoDesc: 160,
    ogTitle: 90,
    ogDesc: 200,
  };

  // Helper to render character counter with colored thresholds
  const renderCounter = (currentLength: number, max: number) => {
    const isClose = currentLength > max * 0.85;
    const isOver = currentLength > max;
    return (
      <span className={`text-[10px] font-bold ${
        isOver ? 'text-error' : isClose ? 'text-orange-500' : 'text-on-surface-variant/60'
      }`}>
        {currentLength} / {max}
      </span>
    );
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden select-none">
      
      {/* Panel Header & Tabs */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-2 pt-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'meta' 
                ? 'bg-surface-container-lowest text-primary border-t border-l border-r border-outline-variant/30' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Engine SEO</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('og')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'og' 
                ? 'bg-surface-container-lowest text-primary border-t border-l border-r border-outline-variant/30' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Open Graph (Social)</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        
        {/* ===================== TAB: SEARCH ENGINE SEO ===================== */}
        {activeTab === 'meta' && (
          <div className="animate-[fadeIn_0.2s_ease-out] flex flex-col gap-4">
            
            {/* Focus Keyword */}
            <div>
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Focus Keyword</span>
              </label>
              <input
                type="text"
                value={focusKey}
                onChange={(e) => onChange('focusKeyword', e.target.value)}
                placeholder="e.g. nextjs tutorial 2026"
                className={`w-full bg-surface-container-low border rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none transition-colors ${
                  errors.focusKeyword ? 'border-error focus:ring-1 focus:ring-error' : 'border-outline-variant/60 focus:border-primary'
                }`}
              />
              {errors.focusKeyword && (
                <span className="text-[10px] text-error flex items-center gap-1 mt-1 font-bold">
                  <AlertCircle className="w-3 h-3" /> {errors.focusKeyword}
                </span>
              )}
            </div>

            {/* SEO Title */}
            <div>
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>SEO Title</span>
                {renderCounter(seoTitle.length, LIMITS.seoTitle)}
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => onChange('seoTitle', e.target.value)}
                placeholder="Will fallback to article title if empty"
                className={`w-full bg-surface-container-low border rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none transition-colors ${
                  errors.seoTitle ? 'border-error focus:ring-1 focus:ring-error' : 'border-outline-variant/60 focus:border-primary'
                }`}
              />
              {errors.seoTitle && (
                <span className="text-[10px] text-error flex items-center gap-1 mt-1 font-bold">
                  <AlertCircle className="w-3 h-3" /> {errors.seoTitle}
                </span>
              )}
            </div>

            {/* SEO Description */}
            <div>
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Meta Description</span>
                {renderCounter(seoDesc.length, LIMITS.seoDesc)}
              </label>
              <textarea
                value={seoDesc}
                onChange={(e) => onChange('seoDescription', e.target.value)}
                placeholder="Compelling description summing up the post (usually <160 characters)"
                rows={3}
                className={`w-full bg-surface-container-low border rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none transition-colors resize-none ${
                  errors.seoDescription ? 'border-error focus:ring-1 focus:ring-error' : 'border-outline-variant/60 focus:border-primary'
                }`}
              />
              {errors.seoDescription && (
                <span className="text-[10px] text-error flex items-center gap-1 mt-1 font-bold">
                  <AlertCircle className="w-3 h-3" /> {errors.seoDescription}
                </span>
              )}
            </div>

            {/* Canonical URL */}
            <div>
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <span>Canonical URL</span>
                <span title="Use only if this post is republished from another source.">
                  <HelpCircle className="w-3.5 h-3.5 text-on-surface-variant/60" />
                </span>
              </label>
              <input
                type="url"
                value={canonical}
                onChange={(e) => onChange('canonicalUrl', e.target.value)}
                placeholder="https://original-source.com/article"
                className={`w-full bg-surface-container-low border rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none transition-colors ${
                  errors.canonicalUrl ? 'border-error focus:ring-1 focus:ring-error' : 'border-outline-variant/60 focus:border-primary'
                }`}
              />
              {errors.canonicalUrl && (
                <span className="text-[10px] text-error flex items-center gap-1 mt-1 font-bold">
                  <AlertCircle className="w-3 h-3" /> {errors.canonicalUrl}
                </span>
              )}
            </div>

          </div>
        )}

        {/* ===================== TAB: OPEN GRAPH (SOCIAL) ===================== */}
        {activeTab === 'og' && (
          <div className="animate-[fadeIn_0.2s_ease-out] flex flex-col gap-4">
            
            {/* OG Title */}
            <div>
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Facebook / Twitter Title</span>
                {renderCounter(ogTitle.length, LIMITS.ogTitle)}
              </label>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => onChange('ogTitle', e.target.value)}
                placeholder="Will fallback to SEO Title if empty"
                className={`w-full bg-surface-container-low border rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none transition-colors ${
                  errors.ogTitle ? 'border-error focus:ring-1 focus:ring-error' : 'border-outline-variant/60 focus:border-primary'
                }`}
              />
            </div>

            {/* OG Description */}
            <div>
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Facebook / Twitter Description</span>
                {renderCounter(ogDesc.length, LIMITS.ogDesc)}
              </label>
              <textarea
                value={ogDesc}
                onChange={(e) => onChange('ogDescription', e.target.value)}
                placeholder="Will fallback to Meta Description if empty"
                rows={3}
                className={`w-full bg-surface-container-low border rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none transition-colors resize-none ${
                  errors.ogDescription ? 'border-error focus:ring-1 focus:ring-error' : 'border-outline-variant/60 focus:border-primary'
                }`}
              />
            </div>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs text-on-surface-variant flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>
                <strong>Social Preview Image:</strong> The OpenGraph (OG) Image is selected using the main Cover Image component. We automatically inject its CDN path into the metadata head.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
