import { publicClient } from "../publicClient";
import { ApiResponse } from "../../../types/api.types";

/**
 * Public non-blocking tracking endpoint to ingest page view traffic telemetry asynchronously.
 * @param blogId - UUID of the blog post being viewed.
 * @param readTimeSec - Number of seconds spent viewing the page.
 * @param isBounce - Whether the user bounced off immediately.
 */
export const trackView = async (
  blogId: string,
  readTimeSec: number = 0,
  isBounce: boolean = false
): Promise<ApiResponse<null>> => {
  try {
    const response = await publicClient.post<ApiResponse<null>>(
      "/analytics/track/view",
      {
        blogId,
        readTimeSec,
        isBounce,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
