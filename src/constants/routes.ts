/**
 * Application routes configuration constants.
 * Provides central access to public sitemap links, auth points, and administrative sections.
 */
export const ROUTES = {
  // Public facing routes
  HOME: "/",
  SEARCH: "/search",
  BLOG_DETAIL: (slug: string) => `/${slug}`,
  CATEGORY: (slug: string) => `/search/category/${slug}`,
  TAG: (slug: string) => `/search/tag/${slug}`,

  // Auth routes
  LOGIN: "/login",

  // Protected Admin routes
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_BLOGS: "/admin/blogs",
  ADMIN_BLOG_CREATE: "/admin/blogs/new",
  ADMIN_BLOG_EDIT: (id: number | string) => `/admin/blogs/${id}`,
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_TAGS: "/admin/tags",
  ADMIN_DIAGNOSTICS: "/admin/diagnostics",
  ADMIN_ERROR_LOGS: "/admin/diagnostics/error-logs",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_ADS: "/admin/ads",
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
