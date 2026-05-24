"use client";

import React from 'react';
import { Calendar, Star, Save, Send, Loader2, CheckCircle2, Clock } from 'lucide-react';

export interface PublishData {
  status: 'draft' | 'published';
  publishedAt: string | null;
  isFeatured: boolean;
}

interface PublishPanelProps {
  data: PublishData;
  onChange: (field: keyof PublishData, value: any) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting?: boolean;
}

export function PublishPanel({
  data,
  onChange,
  onSaveDraft,
  onPublish,
  isSubmitting = false
}: PublishPanelProps) {

  const { status, publishedAt, isFeatured } = data;

  // Convert standard ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
  const formatForInput = (isoString: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    // Format to local ISO string and slice off seconds and timezone
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      onChange('publishedAt', null);
      return;
    }
    const isoDate = new Date(val).toISOString();
    onChange('publishedAt', isoDate);
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm overflow-hidden select-none">
      
      {/* Header */}
      <div className="border-b border-outline-variant/30 bg-surface-container-low px-4 py-3 flex items-center justify-between">
        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5 text-primary" />
          <span>Publish Settings</span>
        </h4>
        
        {/* Dynamic Status Badge */}
        {status === 'published' ? (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Published
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-surface-container-highest text-on-surface-variant border border-outline-variant/40 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Draft
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* Featured Toggle */}
        <label className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isFeatured ? 'bg-amber-500/20 text-amber-600' : 'bg-surface-container-highest text-on-surface-variant'}`}>
              <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Featured Post</span>
              <span className="text-[10px] text-on-surface-variant">Highlight on homepage hero</span>
            </div>
          </div>
          {/* Custom Toggle Switch */}
          <div className={`relative w-10 h-6 rounded-full transition-colors ${isFeatured ? 'bg-amber-500' : 'bg-outline-variant/60'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`} />
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isFeatured} 
              onChange={(e) => onChange('isFeatured', e.target.checked)} 
            />
          </div>
        </label>

        {/* Publish Date Picker */}
        <div>
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-on-surface-variant/70" />
            <span>Publication Date</span>
          </label>
          <input
            type="datetime-local"
            value={formatForInput(publishedAt)}
            onChange={handleDateChange}
            className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs text-on-surface px-3 py-2 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          />
          <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
            Leave empty to auto-set upon publishing. You can back-date or schedule future posts.
          </p>
        </div>

      </div>

      {/* Action Triggers Footer */}
      <div className="bg-surface-container p-4 flex flex-col gap-2 border-t border-outline-variant/30">
        
        {/* Publish Button */}
        <button
          type="button"
          onClick={onPublish}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === 'published' ? (
            <Send className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{isSubmitting ? 'Saving...' : status === 'published' ? 'Update Published Post' : 'Publish Now'}</span>
        </button>

        {/* Save Draft Button */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{status === 'draft' ? 'Update Draft' : 'Revert to Draft'}</span>
        </button>

      </div>
    </div>
  );
}
