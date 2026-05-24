import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

/** Utility to merge tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-ui-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-primary text-on-primary hover:opacity-90 shadow-sm',
      secondary: 'bg-secondary text-on-secondary hover:opacity-90 shadow-sm',
      outline: 'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low',
      ghost: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
      danger: 'bg-error text-on-error hover:opacity-90 shadow-sm'
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-ui-sm rounded-md',
      md: 'h-10 px-4 text-ui-medium rounded-lg',
      lg: 'h-12 px-6 text-ui-medium rounded-xl',
      icon: 'h-10 w-10 rounded-full flex items-center justify-center'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-[18px] h-[18px] animate-spin mr-2" />
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
