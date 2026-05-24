import { User } from "./user.types";
import { Category } from "./category.types";
import { Tag } from "./tag.types";
import { BlogImage } from "./image.types";
import { BlogAnalytics } from "./analytics.types";

/**
 * Editorial status of a Blog post in the system.
 */
export type BlogStatus = "draft" | "published";

/**
 * Core Blog post schema matching database definitions and populated relationships.
 */
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  contentHtml: string;
  authorId: string;
  categoryId: string | null;
  status: BlogStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  readTimeMinutes: number;
  
  // SEO Meta Attributes
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  structuredData: Record<string, unknown> | null;
  
  // Open Graph / Rich Snippets
  ogImageUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  
  // Populated Relations
  author?: Pick<User, "id" | "name" | "email" | "avatarUrl" | "role">;
  category?: Category | null;
  tags?: Tag[];
  images?: BlogImage[];
  blogAnalytics?: BlogAnalytics;
  
  // Audit Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Summary view structure for list responses, designed to minimize network transfer.
 */
export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: BlogStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  readTimeMinutes: number;
  ogImageUrl: string | null;
  authorId: string;
  categoryId: string | null;
  
  // Populated Relations
  author?: Pick<User, "id" | "name" | "email" | "avatarUrl" | "role">;
  category?: Pick<Category, "id" | "name" | "slug"> | null;
  Category?: Pick<Category, "id" | "name" | "slug"> | null;
  tags?: Pick<Tag, "id" | "name" | "slug">[];
  Tags?: Pick<Tag, "id" | "name" | "slug">[];
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload interface for creating a new Blog post.
 * Request payload types strictly use snake_case per validator constraints.
 */
export interface CreateBlogPayload {
  title: string;
  slug?: string;
  excerpt?: string;
  content_html: string;
  category_id?: string | null;
  tags?: string[];
  status?: BlogStatus;
  is_featured?: boolean;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  focus_keyword?: string | null;
  structured_data?: Record<string, unknown> | null;
  og_image_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
}

/**
 * Payload interface for updating an existing Blog post.
 * Request payload types strictly use snake_case per validator constraints.
 */
export type UpdateBlogPayload = Partial<CreateBlogPayload>;

/**
 * Optional query parameters for pagination and filtering blog posts.
 */
export interface BlogFilterParams {
  page?: number;
  limit?: number;
  status?: BlogStatus;
  categoryId?: string;
  authorId?: string;
  isFeatured?: boolean;
}

