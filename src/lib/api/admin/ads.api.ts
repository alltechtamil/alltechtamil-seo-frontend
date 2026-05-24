import { adminClient } from "../adminClient";
import { ApiResponse } from "../../../types/api.types";
import { AdUnit, CreateAdPayload, UpdateAdPayload } from "../../../types/ad.types";

/**
 * Fetch all configured advertisement placements for administration.
 */
export const getAdminAds = async (): Promise<ApiResponse<AdUnit[]>> => {
  try {
    const response = await adminClient.get<ApiResponse<AdUnit[]>>("/ads");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new advertisement placement unit layout.
 */
export const createAd = async (
  payload: CreateAdPayload
): Promise<ApiResponse<AdUnit>> => {
  try {
    const response = await adminClient.post<ApiResponse<AdUnit>>("/ads", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing advertisement placement configuration by UUID.
 */
export const updateAd = async (
  id: string,
  payload: UpdateAdPayload
): Promise<ApiResponse<AdUnit>> => {
  try {
    const response = await adminClient.patch<ApiResponse<AdUnit>>(
      `/ads/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Permanently delete an advertisement placement by UUID.
 */
export const deleteAd = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await adminClient.delete<ApiResponse<null>>(`/ads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
