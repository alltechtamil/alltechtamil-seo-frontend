import React from 'react';
import { cn } from './Button';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="block font-ui-sm text-on-surface-variant">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full p-3 bg-surface-container-lowest border rounded-lg text-ui-sm focus:outline-none focus:ring-2 transition-all placeholder:text-outline/70 resize-y min-h-[80px]',
            error
              ? 'border-error focus:ring-error/20'
              : 'border-outline-variant focus:ring-primary/20',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-error' : 'text-on-surface-variant')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
