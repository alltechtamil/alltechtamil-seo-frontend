/**
 * Rich Media Attachment and Image asset metadata processed and hosted via CDNs.
 */
export interface BlogImage {
  id: string;
  blogId: string | null;
  githubPath: string;
  cdnUrl: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  mimeType: string;
  altText: string | null;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Optional query parameters for image pagination.
 */
export interface ImageFilterParams {
  page?: number;
  limit?: number;
}

