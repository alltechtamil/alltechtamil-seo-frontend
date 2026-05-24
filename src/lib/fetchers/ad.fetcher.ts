import { cache } from "react";
import { getPublicAds as apiGetPublicAds } from "../api/public/ads.api";
import { ApiResponse } from "../../types/api.types";
import { AdUnit, AdPlacement, DeviceTarget } from "../../types/ad.types";

/**
 * Server-side deduplicated retrieval of active banner advertisement placements.
 * @param placement - The layout slot placement identifier.
 * @param deviceTarget - Optional client viewport target device filter.
 * Deduplicates banner requests within the same server request/render tree pass.
 */
export const getPublicAds = cache(
  async (
    placement: AdPlacement,
    deviceTarget?: DeviceTarget
  ): Promise<ApiResponse<AdUnit[]>> => {
    try {
      return await apiGetPublicAds(placement, deviceTarget);
    } catch (error) {
      throw error;
    }
  }
);
