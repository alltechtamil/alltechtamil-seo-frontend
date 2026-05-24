import { publicClient } from "../publicClient";
import { ApiResponse } from "../../../types/api.types";
import { AdUnit, AdPlacement, DeviceTarget } from "../../../types/ad.types";

/**
 * Fetch active advertisement placements for a given placement slot.
 * @param placement - The layout slot placement (e.g. HOME_TOP).
 * @param deviceTarget - Optional viewport target filter (e.g. desktop, mobile).
 */
export const getPublicAds = async (
  placement: AdPlacement,
  deviceTarget?: DeviceTarget
): Promise<ApiResponse<AdUnit[]>> => {
  try {
    const response = await publicClient.get<ApiResponse<AdUnit[]>>("/ads", {
      params: {
        placement,
        device_target: deviceTarget,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
