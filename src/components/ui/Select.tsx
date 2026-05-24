import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './Button';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="block font-ui-sm text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={cn(
              'w-full h-10 px-4 pr-10 bg-surface-container-lowest border rounded-lg text-ui-sm focus:outline-none focus:ring-2 transition-all appearance-none',
              error
                ? 'border-error focus:ring-error/20'
                : 'border-outline-variant focus:ring-primary/20',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3 pointer-events-none text-outline flex items-center justify-center">
            <ChevronDown className="w-5 h-5" />
          </span>
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

Select.displayName = 'Select';
