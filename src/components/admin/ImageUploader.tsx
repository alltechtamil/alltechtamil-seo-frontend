"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, X, Loader2, ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  /** The current loaded Image URL, if any */
  value?: string | null;
  /** Callback triggered when a new image URL is successfully uploaded and returned */
  onChange: (url: string | null) => void;
  /** The async upload handler that takes the raw file and returns the CDN URL */
  onUpload: (file: File) => Promise<string>;
  /** Maximum allowed file size in Megabytes (default: 5MB) */
  maxSizeMB?: number;
  /** Label for the uploader */
  label?: string;
  /** Small helper text to display under the label */
  helperText?: string;
}

export function ImageUploader({
  value,
  onChange,
  onUpload,
  maxSizeMB = 5,
  label = "Cover Image",
  helperText = "WebP, PNG, or JPEG (Max 5MB)"
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setLocalError(null);

    // Handle Client-Side Validation Rejections
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setLocalError(`File exceeds the ${maxSizeMB}MB size limit.`);
      } else {
        setLocalError(rejection.errors[0].message);
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    try {
      setIsUploading(true);
      // Execute the provided async uploader payload
      const cdnUrl = await onUpload(file);
      onChange(cdnUrl);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [maxSizeMB, onUpload, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: maxSizeBytes,
    multiple: false,
    disabled: isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setLocalError(null);
  };

  return (
    <div className="flex flex-col gap-2 select-none">
      
      {/* Label & Context Header */}
      <div>
        <label className="text-xs font-bold text-on-surface uppercase tracking-wider">{label}</label>
        {helperText && (
          <p className="text-[10px] text-on-surface-variant mt-0.5">{helperText}</p>
        )}
      </div>

      {/* Validation Error Banner */}
      {localError && (
        <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-bold animate-[fadeIn_0.2s_ease-out]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      {/* Upload Region / Preview Window */}
      <div 
        {...getRootProps()} 
        className={`relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
          isDragActive 
            ? 'border-primary bg-primary/5 border-solid' 
            : value 
              ? 'border-outline-variant/30 bg-surface-container-lowest border-solid' 
              : 'border-outline-variant/60 border-dashed bg-surface-container-low hover:bg-surface-container hover:border-primary/50'
        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />

        {/* State 1: Active Upload Spinner */}
        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs font-bold text-primary animate-pulse">Uploading Media...</span>
          </div>
        )}

        {/* State 2: Existing Image Preview */}
        {value && !isUploading ? (
          <div className="relative w-full h-full group">
            <Image 
              src={value} 
              alt="Uploaded Preview" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Hover Backdrop Options */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleRemove}
                className="p-3 bg-error text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                title="Remove Image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Top-Right Absolute Edit Hint */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Click to Replace
            </div>
          </div>
        ) : !isUploading ? (
          // State 3: Empty Dropzone State
          <div className="flex flex-col items-center justify-center p-6 text-center text-on-surface-variant">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${
              isDragActive ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              {isDragActive ? <UploadCloud className="w-6 h-6 animate-bounce" /> : <ImageIcon className="w-6 h-6" />}
            </div>
            <p className="text-xs font-bold text-on-surface">
              {isDragActive ? 'Drop image to upload' : 'Drag & drop image here'}
            </p>
            <p className="text-[10px] text-on-surface-variant/80 mt-1">
              or click to browse your local files
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
}
