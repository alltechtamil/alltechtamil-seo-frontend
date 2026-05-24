'use client';

import React, { useEffect, useRef } from 'react';

export interface BlogContentProps {
    html: string;
}

export function BlogContent({ html }: BlogContentProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // dangerouslySetInnerHTML does not execute <script> tags.
        // We must manually extract and re-append them to the DOM.
        const scripts = containerRef.current.querySelectorAll('script');
        
        // Keep track of added scripts for cleanup
        const addedScripts: HTMLScriptElement[] = [];

        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            
            // Append to body to ensure global execution scope
            document.body.appendChild(newScript);
            addedScripts.push(newScript);
            
            // Remove the dead script tag from the container
            oldScript.remove();
        });

        // Cleanup function to prevent memory leaks or duplicate executions
        return () => {
            addedScripts.forEach(script => script.remove());
        };
    }, [html]);

    return (
        <div 
            ref={containerRef}
            className="article-content blog-typography font-serif text-lg md:text-xl leading-relaxed text-on-surface" 
            dangerouslySetInnerHTML={{ __html: html }} 
        />
    );
}
