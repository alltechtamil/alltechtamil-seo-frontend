"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Image as ImageIcon, AlertCircle, Copy, Check } from 'lucide-react';
import { BlogImage } from '@/types/image.types';
import { getAdminImagesByBlogId, getAdminImages } from '@/lib/api/admin/images.api';

interface ImagePickerProps {
  /** If provided, attempts to fetch images specifically linked to this blog ID first */
  blogId?: string;
  /** Callback triggered when a user clicks on a previously uploaded image */
  onSelect: (cdnUrl: string) => void;
}

export function ImagePicker({ blogId, onSelect }: ImagePickerProps) {
  const [images, setImages] = useState<BlogImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Priority 1: If blogId exists, fetch blog-specific attachments
        if (blogId) {
          const res = await getAdminImagesByBlogId(blogId);
          if (isMounted) setImages(res.data);
        } else {
          // Priority 2: Fetch global recent image uploads if no specific blog context
          const res = await getAdminImages({ limit: 20 });
          if (isMounted) setImages(res.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load image library.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span className="text-xs text-on-surface-variant font-bold mt-2 animate-pulse">Loading Asset Library...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 flex items-center gap-3 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-bold">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-2xl text-on-surface-variant text-center px-4">
        <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
        <p className="text-xs font-bold text-on-surface">No images found</p>
        <p className="text-[10px] opacity-70 mt-0.5">Upload new media to see it appear in your library.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm select-none">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          <span>Image Library</span>
        </h4>
        <span className="text-[10px] font-bold text-on-surface-variant/80 bg-surface-container-low px-2 py-0.5 rounded-md border border-outline-variant/50">
          {images.length} {images.length === 1 ? 'Asset' : 'Assets'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
        {images.map((img) => (
          <div 
            key={img.id}
            onClick={() => onSelect(img.cdnUrl)}
            className="group relative aspect-video rounded-xl overflow-hidden border border-outline-variant/50 cursor-pointer bg-surface-container shadow-sm hover:shadow-md transition-all hover:border-primary/50 active:scale-95"
            title={img.altText || 'Select Image'}
          >
            <Image
              src={img.cdnUrl}
              alt={img.altText || "Library Image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded-md tracking-wider">
                Select
              </span>
            </div>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={(e) => handleCopyLink(e, img.cdnUrl, img.id)}
              className="absolute top-1.5 right-1.5 z-10 p-1.5 bg-black/60 hover:bg-primary/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
              title="Copy Image URL"
            >
              {copiedId === img.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Dimensions Badge */}
            <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded font-mono pointer-events-none">
              {img.width}x{img.height}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
