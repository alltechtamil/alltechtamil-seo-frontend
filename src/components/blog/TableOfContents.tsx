'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
    contentSelector?: string;
}

export function TableOfContents({ contentSelector = '.blog-typography' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Small timeout to allow content to render first
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll(`${contentSelector} h2, ${contentSelector} h3`));
      
      const parsedHeadings = elements.map((elem) => {
        // TipTap may not always generate IDs, so we generate them if missing
        if (!elem.id) {
          elem.id = elem.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `h-${Math.random().toString(36).substr(2, 9)}`;
        }
        return {
          id: elem.id,
          text: elem.textContent || '',
          level: elem.tagName === 'H2' ? 2 : 3,
        };
      });

      setHeadings(parsedHeadings);

      const handleScroll = () => {
        // Offset for fixed headers or sticky elements
        const offset = 150; 
        
        // Default to first heading if none have passed the offset
        let currentActive = parsedHeadings[0]?.id || '';
        
        // If we are at the very bottom of the page, highlight the last item
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 90) {
          if (parsedHeadings.length > 0) {
            setActiveId(parsedHeadings[parsedHeadings.length - 1].id);
          }
          return;
        }

        for (const heading of parsedHeadings) {
            const element = document.getElementById(heading.id);
            if (element) {
                const top = element.getBoundingClientRect().top;
                if (top <= offset) {
                    currentActive = heading.id;
                } else {
                    break; // Elements are sequential, so we stop at the first one below the offset
                }
            }
        }
        
        setActiveId(currentActive);
      };

      // Run immediately to set initial active state
      handleScroll();

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, 300); // Increased timeout slightly to ensure all images and fonts have adjusted layout

    return () => clearTimeout(timer);
  }, [contentSelector]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-surface-container-lowest/70 backdrop-blur-md p-4 rounded-2xl border border-outline-variant/80 shadow-sm">
      <h5 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-4 border-b border-outline-variant/40 pb-2">
        CONTENTS
      </h5>
      <ul className="flex flex-col gap-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                // Update URL without jump
                history.pushState(null, '', `#${h.id}`);
              }}
              className={cn(
                "block py-1 border-l-2 pl-3 text-sm transition-colors",
                activeId === h.id
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-on-surface-variant hover:text-primary",
                h.level === 3 && "ml-4"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
