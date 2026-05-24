import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="block font-ui-sm text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-outline flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-10 bg-surface-container-lowest border rounded-lg text-ui-sm focus:outline-none focus:ring-2 transition-all placeholder:text-outline/70',
              error
                ? 'border-error focus:ring-error/20'
                : 'border-outline-variant focus:ring-primary/20',
              leftIcon ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-outline flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-error' : 'text-on-surface-variant')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
