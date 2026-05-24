/**
 * Core Category taxonomy schema matching database definitions.
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload interface for creating a new Category.
 * Aligned with backend Joi validation schemas.
 */
export interface CreateCategoryPayload {
  name: string;
  slug?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Payload interface for partially updating an existing Category.
 * Aligned with backend Joi validation schemas.
 */
export interface UpdateCategoryPayload {
  name?: string;
  slug?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  sortOrder?: number;
}
