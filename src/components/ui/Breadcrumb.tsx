/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from './Button';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 sm:space-x-2 text-ui-sm", className)} {...props}>
      <ol className="flex items-center space-x-1 sm:space-x-2 w-full min-w-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={cn("flex items-center", isLast ? "min-w-0" : "shrink-0")}>
              {isLast ? (
                <span className="text-on-surface font-ui-medium truncate block w-full" title={item.label} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={(item.href || '#') as any} 
                  className="text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              )}
              
              {!isLast && (
                <ChevronRight className="w-4 h-4 text-outline-variant mx-1 sm:mx-2 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
