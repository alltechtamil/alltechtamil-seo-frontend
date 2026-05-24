import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center p-10 border border-outline-variant/30 border-dashed rounded-2xl bg-surface-container-lowest/50",
        className
      )}
      {...props}
    >
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-outline mb-4">
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="font-headline-md text-lg text-on-surface mb-2">{title}</h3>
      {description && (
        <p className="text-ui-sm text-on-surface-variant max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
