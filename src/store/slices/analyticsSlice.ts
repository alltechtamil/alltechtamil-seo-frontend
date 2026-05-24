import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAnalyticsOverview,
  getBlogStats,
  getSearchTrends,
} from "../../lib/api/admin/analytics.api";
import { trackView as apiTrackView } from "../../lib/api/public/analytics.api";
import { AnalyticsOverview, BlogAnalytics, SearchTrendItem } from "../../types/analytics.types";

export interface AnalyticsState {
  overview: AnalyticsOverview | null;
  blogStats: BlogAnalytics | null;
  searchTrends: SearchTrendItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  overview: null,
  blogStats: null,
  searchTrends: [],
  isLoading: false,
  error: null,
};

export const fetchOverview = createAsyncThunk(
  "analytics/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAnalyticsOverview();
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch analytics overview");
    }
  }
);

export const fetchBlogStats = createAsyncThunk(
  "analytics/fetchBlogStats",
  async (blogId: string, { rejectWithValue }) => {
    try {
      const response = await getBlogStats(blogId);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch blog stats");
    }
  }
);

export const fetchSearchTrends = createAsyncThunk(
  "analytics/fetchSearchTrends",
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const response = await getSearchTrends(limit);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch search trends");
    }
  }
);

export const trackView = createAsyncThunk(
  "analytics/trackView",
  async (payload: { blogId: string; readTimeSec?: number; isBounce?: boolean }, { rejectWithValue }) => {
    try {
      const response = await apiTrackView(payload.blogId, payload.readTimeSec, payload.isBounce);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to track view");
    }
  }
);

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearBlogStats: (state) => {
      state.blogStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOverview
      .addCase(fetchOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchBlogStats
      .addCase(fetchBlogStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogStats = action.payload;
      })
      .addCase(fetchBlogStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchSearchTrends
      .addCase(fetchSearchTrends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchTrends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchTrends = action.payload;
      })
      .addCase(fetchSearchTrends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBlogStats } = analyticsSlice.actions;
export default analyticsSlice.reducer;
