/**
 * Placement locations for ads within the blogging platform.
 * Aligns with the core database and API schema constraints.
 */
export const AD_PLACEMENTS = {
  HOME_TOP: "HOME_TOP",
  HOME_MIDDLE: "HOME_MIDDLE",
  HOME_BOTTOM: "HOME_BOTTOM",
  SEARCH_TOP: "SEARCH_TOP",
  SEARCH_INLINE: "SEARCH_INLINE",
  SEARCH_BOTTOM: "SEARCH_BOTTOM",
  BLOG_TOP: "BLOG_TOP",
  BLOG_INLINE_1: "BLOG_INLINE_1",
  BLOG_INLINE_2: "BLOG_INLINE_2",
  BLOG_BOTTOM: "BLOG_BOTTOM",
  BLOG_SIDEBAR: "BLOG_SIDEBAR",
} as const;

export type AdPlacement = typeof AD_PLACEMENTS[keyof typeof AD_PLACEMENTS];

/**
 * Screen size target device configurations for ad loading optimization.
 */
export const DEVICE_TARGETS = {
  ALL: "all",
  DESKTOP: "desktop",
  MOBILE: "mobile",
} as const;

export type DeviceTarget = typeof DEVICE_TARGETS[keyof typeof DEVICE_TARGETS];

/**
 * Human-readable placement labels for select dropdowns in forms or administrative panels.
 */
export const AD_PLACEMENT_LABELS: Record<AdPlacement, string> = {
  [AD_PLACEMENTS.HOME_TOP]: "Home Page - Top Banner",
  [AD_PLACEMENTS.HOME_MIDDLE]: "Home Page - Middle Feed Section",
  [AD_PLACEMENTS.HOME_BOTTOM]: "Home Page - Footer Banner",
  [AD_PLACEMENTS.SEARCH_TOP]: "Search Feed - Top Header Banner",
  [AD_PLACEMENTS.SEARCH_INLINE]: "Search Feed - Card Feed Grid Divider",
  [AD_PLACEMENTS.SEARCH_BOTTOM]: "Search Feed - Footer Banner",
  [AD_PLACEMENTS.BLOG_TOP]: "Blog Post - Under Hero Cover Header",
  [AD_PLACEMENTS.BLOG_INLINE_1]: "Blog Post - First Paragraph Splitter",
  [AD_PLACEMENTS.BLOG_INLINE_2]: "Blog Post - Middle Content Splitter",
  [AD_PLACEMENTS.BLOG_BOTTOM]: "Blog Post - Author Bio / Footer Section",
  [AD_PLACEMENTS.BLOG_SIDEBAR]: "Blog Post - Right Column Sidebar Area",
};

/**
 * Human-readable device targeting labels.
 */
export const DEVICE_TARGET_LABELS: Record<DeviceTarget, string> = {
  [DEVICE_TARGETS.ALL]: "All Viewports",
  [DEVICE_TARGETS.DESKTOP]: "Desktop Devices Only",
  [DEVICE_TARGETS.MOBILE]: "Mobile Devices Only",
};
