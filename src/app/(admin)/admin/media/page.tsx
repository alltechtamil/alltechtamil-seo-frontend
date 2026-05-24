"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  ImageIcon, 
  Upload, 
  Trash2, 
  Link as LinkIcon, 
  CheckCircle2, 
  Loader2, 
  RefreshCw,
  Search,
  AlertCircle
} from 'lucide-react';
import { getAdminImages, uploadImage, deleteImage } from '@/lib/api/admin/images.api';
import { BlogImage } from '@/types/image.types';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function MediaLibraryPage() {
  const [images, setImages] = useState<BlogImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Pagination & Search (Local filter for now as API might not support deep search yet)
  const [searchQuery, setSearchQuery] = useState('');
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch generous amount for dashboard viewing
      const response = await getAdminImages({ page: 1, limit: 50 });
      setImages(response.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load media library.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image exceeds 5MB size limit.");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadImage(file);
      if (res.data) {
        setImages((prev) => [res.data, ...prev]);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    try {
      await deleteImage(imageToDelete);
      setImages(prev => prev.filter(img => img.id !== imageToDelete));
      setImageToDelete(null);
    } catch (err: any) {
      alert(err?.message || "Failed to delete image.");
    }
  };

  const filteredImages = images.filter(img => 
    (img.githubPath.split('/').pop() || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (img.altText && img.altText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 select-none max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h3 className="font-extrabold text-xl text-on-surface tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span>Media & Asset Library</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage your global CDN images, upload new assets, and copy optimized delivery URLs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchImages}
            disabled={isLoading || isUploading}
            className="flex items-center justify-center p-2.5 border border-outline-variant bg-surface-container-low hover:bg-surface-container-high rounded-xl text-on-surface-variant transition-all active:scale-98 disabled:opacity-50"
            title="Refresh library"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/95 text-on-primary font-bold rounded-xl text-xs transition-all shadow-sm active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{isUploading ? 'Uploading...' : 'Upload Asset'}</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Search by file name or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant focus:border-primary rounded-xl text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none transition-all"
          />
        </div>
        <div className="ml-auto text-xs font-bold text-on-surface-variant">
          {filteredImages.length} {filteredImages.length === 1 ? 'Asset' : 'Assets'}
        </div>
      </div>

      {/* Image Grid */}
      {error ? (
        <div className="p-8 bg-error/5 border border-error/20 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-8 h-8 text-error" />
          <div>
            <h4 className="font-bold text-on-surface text-sm">Failed to load media</h4>
            <p className="text-xs text-on-surface-variant mt-1">{error}</p>
          </div>
        </div>
      ) : isLoading && images.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="aspect-square bg-surface-container-low rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-16 text-center bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/50">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-on-surface tracking-tight">No assets found</h4>
            <p className="text-xs text-on-surface-variant max-w-sm mt-1">
              Upload your first image to populate the media library.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img) => {
            const fileName = img.githubPath.split('/').pop() || 'image';
            const format = img.mimeType.split('/')[1] || 'webp';
            return (
            <div 
              key={img.id} 
              className="group relative aspect-square bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden hover:border-primary/40 hover:shadow-md transition-all flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative flex-1 bg-surface-container-low flex items-center justify-center overflow-hidden p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img.cdnUrl} 
                  alt={img.altText || fileName} 
                  className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleCopyLink(img.cdnUrl, img.id)}
                    className="p-2.5 bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface rounded-full shadow-sm transition-colors"
                    title="Copy CDN Link"
                  >
                    {copiedId === img.id ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-emerald-300" />
                    ) : (
                      <LinkIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setImageToDelete(img.id)}
                    className="p-2.5 bg-surface-container-lowest hover:bg-error hover:text-on-error text-error rounded-full shadow-sm transition-colors"
                    title="Permanently Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image Meta Footer */}
              <div className="p-3 border-t border-outline-variant/20 bg-surface-container-lowest">
                <p className="text-[10px] font-bold text-on-surface truncate" title={fileName}>
                  {fileName}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[9px] font-mono text-on-surface-variant/70 uppercase">
                    {(img.fileSizeBytes / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-[9px] text-on-surface-variant/70 uppercase font-bold tracking-wider">
                    {format}
                  </p>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}

      {/* Delete Confirmation Interceptor Modal */}
      <ConfirmDialog
        isOpen={imageToDelete !== null}
        title="Delete Image Asset"
        message="Are you sure you want to permanently delete this image? If this image is embedded in published articles, it will immediately break for all readers."
        confirmText="Permanently Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setImageToDelete(null)}
        isDestructive={true}
      />
    </div>
  );
}
