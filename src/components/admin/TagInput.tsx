"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { X, Hash, Loader2, Plus, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminTags, createTag } from '@/store/slices/tagsSlice';
import { Tag } from '@/types/tag.types';

interface TagInputProps {
  /** Array of currently selected Tag IDs */
  value?: string[];
  /** Callback to update the array of Tag IDs */
  onChange: (tagIds: string[]) => void;
  /** Optional form validation error string */
  error?: string;
}

export function TagInput({ value = [], onChange, error }: TagInputProps) {
  const dispatch = useAppDispatch();
  const { adminTags, isLoading } = useAppSelector((state) => state.tags);
  
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch tags on mount if array is empty
  useEffect(() => {
    if (adminTags.length === 0) {
      dispatch(fetchAdminTags(false));
    }
  }, [dispatch, adminTags.length]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute selected Tag objects from the Name array
  const selectedTags = value.map(name => {
    const tag = adminTags.find(t => t.name.toLowerCase() === name.toLowerCase());
    return tag || { id: name, name: name, slug: 'unknown' } as Tag;
  });

  // Compute dropdown suggestions (filter out already selected and match input)
  const suggestions = adminTags.filter(tag => {
    const notSelected = !value.some(v => v.toLowerCase() === tag.name.toLowerCase());
    const matchesSearch = tag.name.toLowerCase().includes(inputValue.toLowerCase());
    return notSelected && matchesSearch;
  });

  const handleSelectTag = (tagName: string) => {
    onChange([...value, tagName]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagNameToRemove: string) => {
    onChange(value.filter(name => name !== tagNameToRemove));
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    // Remove last tag on empty backspace
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    }

    // Create or select on Enter / Comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return;

      // Check if it already exists exactly (case-insensitive)
      const existingTag = adminTags.find(t => t.name.toLowerCase() === trimmed.toLowerCase());
      
      if (existingTag) {
        if (!value.some(v => v.toLowerCase() === existingTag.name.toLowerCase())) {
          handleSelectTag(existingTag.name);
        } else {
          setInputValue(''); // Just clear if already selected
        }
        return;
      }

      // Dispatch Creation
      try {
        setIsCreating(true);
        setLocalError(null);
        // Dispatching createTag Redux thunk
        const resultAction = await dispatch(createTag({ name: trimmed })).unwrap();
        // Unwrap returns the newly created Tag directly
        onChange([...value, resultAction.name]);
        setInputValue('');
      } catch (err: any) {
        setLocalError(err || "Failed to create tag");
      } finally {
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="relative flex flex-col gap-2" ref={wrapperRef}>
      <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
        <Hash className="w-3.5 h-3.5 text-primary" />
        <span>Tags & Keywords</span>
      </label>

      {/* Input Container */}
      <div 
        className={`relative flex items-center flex-wrap gap-2 p-2 bg-surface-container-low border rounded-xl transition-all cursor-text min-h-[46px] ${
          isFocused 
            ? 'border-primary shadow-sm ring-2 ring-primary/10' 
            : error 
              ? 'border-error' 
              : 'border-outline-variant/60 hover:border-outline-variant'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected Tags Render */}
        {selectedTags.map(tag => (
          <span 
            key={tag.id}
            className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-highest border border-outline-variant/40 rounded-lg text-[11px] font-bold text-on-surface select-none animate-[fadeIn_0.15s_ease-out]"
          >
            <Hash className="w-3 h-3 text-on-surface-variant/70" />
            {tag.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag.name); }}
              className="ml-1 p-0.5 rounded-full hover:bg-error/10 hover:text-error text-on-surface-variant transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Text Input */}
        <div className="flex-1 min-w-[120px] flex items-center relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            disabled={isCreating}
            placeholder={value.length === 0 ? "Type to search or create tags..." : ""}
            className="w-full bg-transparent border-none focus:ring-0 text-xs text-on-surface placeholder-on-surface-variant/50 p-1 disabled:opacity-50 outline-none"
          />
          {isCreating && (
            <Loader2 className="absolute right-2 w-4 h-4 text-primary animate-spin" />
          )}
        </div>
      </div>

      {/* Validation or Creation Errors */}
      {(error || localError) && (
        <div className="flex items-center gap-1.5 text-error text-[10px] font-bold mt-1 px-1">
          <AlertCircle className="w-3 h-3" />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Suggestions Dropdown Window */}
      {isFocused && (inputValue.trim() !== '' || suggestions.length > 0) && (
        <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-[fadeIn_0.15s_ease-out] flex flex-col py-1">
          
          {isLoading && suggestions.length === 0 ? (
            <div className="p-3 flex items-center justify-center text-xs text-on-surface-variant gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading tags...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map(tag => (
              <button
                key={tag.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSelectTag(tag.name); }}
                className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container hover:text-primary transition-colors flex items-center gap-2"
              >
                <Hash className="w-3.5 h-3.5 text-on-surface-variant/50" />
                <span>{tag.name}</span>
              </button>
            ))
          ) : inputValue.trim() !== '' ? (
            <div className="p-1">
              <button
                type="button"
                onMouseDown={(e) => { 
                  e.preventDefault(); 
                  const syntheticEvent = { key: 'Enter', preventDefault: () => {} } as any;
                  handleKeyDown(syntheticEvent);
                }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create "{inputValue.trim()}"
              </button>
            </div>
          ) : null}

        </div>
      )}
    </div>
  );
}
