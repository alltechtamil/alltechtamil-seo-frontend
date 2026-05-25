'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Robust HTML decoder and structural parser.
 * Detects if rich text editor has double-escaped raw HTML content,
 * decodes entities, and cleans up fragmented block wrapper paragraphs.
 */
export function processBlogHtml(html: string): string {
    if (!html) return '';

    // Fix nested <a> links generated inside href and src attributes by visual editors
    let cleaned = html.replace(/(href|src)=(\\?["']|&quot;)<a\s+[^>]*?href=(\\?["']|&quot;)([^"'\\]+?)(\\?["']|&quot;)[^>]*?>.*?<\/a>(\\?["']|&quot;)/gi, '$1="$4"');

    // Check if the html contains escaped critical structural tags
    const hasEscapedTags = /&(lt|gt|quot|#39|amp);/i.test(cleaned) && 
        (/&lt;\/?(div|p|a|img|h1|h2|h3|ul|li|button|script|textarea|!--)/i.test(cleaned));

    if (!hasEscapedTags) return cleaned;

    // Decode HTML entities
    let decoded = cleaned
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');

    // Strip wrapping <p> tags for standalone structural or layout tags
    decoded = decoded.replace(/<p>\s*(<\/?(div|a|img|h[1-6]|ul|ol|li|blockquote|pre|code|button|script|textarea|!--)[^>]*>)\s*<\/p>/gi, '$1');

    // Strip `<p>`, `</p>`, `<br>`, and `<a>` tags nested inside script tags to prevent syntax errors during dynamic execution
    decoded = decoded.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
        const cleanContent = scriptContent
            .replace(/<\/?(p|br|div|span)[^>]*>/gi, '')
            .replace(/<\/?a\b[^>]*>/gi, '');
        return `<script>${cleanContent}</script>`;
    });

    return decoded;
}

export interface BlogContentProps {
    html: string;
}

export function BlogContent({ html }: BlogContentProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const processedHtml = React.useMemo(() => {
        return processBlogHtml(html);
    }, [html]);

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
            
            // Clean script content as a fail-safe double defense
            let cleanJS = oldScript.textContent || '';
            cleanJS = cleanJS
                .replace(/<\/?(p|br|div|span)[^>]*>/gi, '')
                .replace(/<\/?a\b[^>]*>/gi, '');

            newScript.textContent = cleanJS;
            
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
    }, [processedHtml]);

    return (
        <div 
            ref={containerRef}
            className="article-content blog-typography font-serif text-lg md:text-xl leading-relaxed text-on-surface" 
            dangerouslySetInnerHTML={{ __html: processedHtml }} 
        />
    );
}
