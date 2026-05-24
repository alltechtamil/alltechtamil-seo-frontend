import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminAds,
  createAd as apiCreateAd,
  updateAd as apiUpdateAd,
  deleteAd as apiDeleteAd,
} from "../../lib/api/admin/ads.api";
import { getPublicAds } from "../../lib/api/public/ads.api";
import { AdUnit, CreateAdPayload, UpdateAdPayload, AdPlacement } from "../../types/ad.types";

export interface AdsState {
  adminAds: AdUnit[];
  publicAds: AdUnit[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdsState = {
  adminAds: [],
  publicAds: [],
  isLoading: false,
  error: null,
};

export const fetchAdminAds = createAsyncThunk(
  "ads/fetchAdminAds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminAds();
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch ads");
    }
  }
);

export const fetchPublicAds = createAsyncThunk(
  "ads/fetchPublicAds",
  async (placement: AdPlacement, { rejectWithValue }) => {
    try {
      const response = await getPublicAds(placement);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch public ads");
    }
  }
);

export const createAd = createAsyncThunk(
  "ads/createAd",
  async (payload: CreateAdPayload, { rejectWithValue }) => {
    try {
      const response = await apiCreateAd(payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create ad");
    }
  }
);

export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async ({ id, payload }: { id: string; payload: UpdateAdPayload }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateAd(id, payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update ad");
    }
  }
);

export const deleteAd = createAsyncThunk(
  "ads/deleteAd",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteAd(id);
      return id;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to delete ad");
    }
  }
);

export const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAdminAds
      .addCase(fetchAdminAds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminAds = action.payload;
      })
      .addCase(fetchAdminAds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchPublicAds
      .addCase(fetchPublicAds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicAds = action.payload;
      })
      .addCase(fetchPublicAds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // createAd
      .addCase(createAd.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminAds.push(action.payload);
      })
      .addCase(createAd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateAd
      .addCase(updateAd.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.adminAds.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.adminAds[index] = action.payload;
        }
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // deleteAd
      .addCase(deleteAd.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminAds = state.adminAds.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default adsSlice.reducer;
