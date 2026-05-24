import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './Button';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'on-surface' | 'on-primary';
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'primary', ...props }, ref) => {
    
    const sizes = {
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px'
    };

    const variants = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      'on-surface': 'text-on-surface-variant',
      'on-primary': 'text-on-primary'
    };

    return (
      <Loader2
        ref={ref}
        className={cn(
          'animate-spin',
          variants[variant],
          className
        )}
        style={{ width: sizes[size], height: sizes[size] }}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';
