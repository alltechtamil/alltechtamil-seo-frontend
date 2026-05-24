"use client";

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
}: ConfirmDialogProps) {
  
  // Close dialog on Escape key hit
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  // Lock page scrolling while dialog modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      
      {/* Semi-transparent Backdrop with Gaussian Blur */}
      <div 
        onClick={onCancel}
        className="fixed inset-0 bg-black/45 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      />

      {/* Modal Dialog Box Card */}
      <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant/60 rounded-3xl shadow-2xl p-6 z-10 overflow-hidden animate-[scaleUp_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
        
        {/* Decorative Top Accent Line */}
        <div className={`absolute top-0 inset-x-0 h-1.5 ${isDestructive ? 'bg-error' : 'bg-primary'}`} />

        {/* Upper Close Trigger */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container rounded-xl transition-all active:scale-95"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dialog Header */}
        <div className="flex items-start gap-4 mt-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
            isDestructive ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
          }`}>
            <AlertTriangle className="w-5 h-5 animate-[pulse_2s_infinite]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-base text-on-surface tracking-tight truncate leading-6">
              {title}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-2 select-text">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-outline hover:bg-surface-container text-xs font-extrabold text-on-surface-variant transition-all active:scale-97 cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              onConfirm();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-md transition-all active:scale-97 cursor-pointer hover:shadow-lg ${
              isDestructive 
                ? 'bg-error hover:bg-error/95 shadow-error/25 hover:shadow-error/30' 
                : 'bg-primary hover:bg-primary/95 shadow-primary/25 hover:shadow-primary/30'
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
