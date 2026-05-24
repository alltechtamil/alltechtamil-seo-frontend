import { useState, useCallback } from 'react';
import { uploadImage as apiUploadImage } from '@/lib/api/admin/images.api';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads an image file to the backend, returning the resultant CDN URL.
   * Optionally ties the image directly to a specific Blog ID.
   */
  const upload = useCallback(async (file: File | Blob, blogId?: string | null, altText?: string | null): Promise<string> => {
    try {
      setIsUploading(true);
      setError(null);
      
      const response = await apiUploadImage(file, blogId, altText);
      
      return response.data.cdnUrl;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to upload image.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const resetError = useCallback(() => setError(null), []);

  return {
    isUploading,
    error,
    upload,
    resetError
  };
}
