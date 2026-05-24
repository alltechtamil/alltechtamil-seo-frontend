'use client';

import React, { useEffect, useState } from 'react';

export function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            if (height <= 0) return;
            
            const scrolled = (winScroll / height) * 100;
            setProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial call
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-16 left-0 w-full h-[2px] bg-transparent z-50 pointer-events-none">
            <div 
                className="h-full bg-primary transition-all duration-150 ease-out" 
                style={{ width: `${progress}%` }} 
            />
        </div>
    );
}
