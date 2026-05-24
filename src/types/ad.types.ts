/**
 * Supported responsive advertisement placements throughout the site layout templates.
 */
export type AdPlacement =
  | "HOME_TOP"
  | "HOME_MIDDLE"
  | "HOME_BOTTOM"
  | "SEARCH_TOP"
  | "SEARCH_INLINE"
  | "SEARCH_BOTTOM"
  | "BLOG_TOP"
  | "BLOG_INLINE_1"
  | "BLOG_INLINE_2"
  | "BLOG_BOTTOM"
  | "BLOG_SIDEBAR";

/**
 * Screen dimensions / Viewport device target for responsive advertisement rendering.
 */
export type DeviceTarget = "all" | "desktop" | "mobile";

/**
 * Core AdUnit schema matching backend database records.
 */
export interface AdUnit {
  id: string;
  name: string;
  placement: AdPlacement;
  adScript: string;
  deviceTarget: DeviceTarget;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload interface for creating a new AdUnit configuration.
 * Fields match the snake_case keys validated by the backend controller.
 */
export interface CreateAdPayload {
  name: string;
  placement: AdPlacement;
  ad_script: string;
  device_target?: DeviceTarget;
  sort_order?: number;
  is_active?: boolean;
}

/**
 * Payload interface for updating an existing AdUnit configuration.
 * Fields match the snake_case keys validated by the backend controller.
 */
export type UpdateAdPayload = Partial<CreateAdPayload>;
