/**
 * Core Tag keyword taxonomy schema matching database definitions.
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  blogsCount?: number;
}

/**
 * Payload interface for creating a new Tag.
 * Aligned with backend Joi validation schemas.
 */
export interface CreateTagPayload {
  name: string;
  slug?: string | null;
}

/**
 * Payload interface for partially updating an existing Tag.
 * Aligned with backend Joi validation schemas.
 */
export interface UpdateTagPayload {
  name?: string;
  slug?: string | null;
}
