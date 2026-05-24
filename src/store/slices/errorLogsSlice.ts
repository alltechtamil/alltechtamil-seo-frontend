import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAdminErrorLogs, clearAllErrorLogs as apiClearAllErrorLogs, bulkDeleteErrorLogs as apiBulkDeleteErrorLogs } from "../../lib/api/admin/error-logs.api";
import { ErrorLog } from "../../types/error-log.types";

export interface ErrorLogsState {
  errorLogs: ErrorLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ErrorLogsState = {
  errorLogs: [],
  meta: null,
  isLoading: false,
  error: null,
};

export const fetchAdminErrorLogs = createAsyncThunk(
  "errorLogs/fetchAdminErrorLogs",
  async (params: { page?: number; limit?: number; level?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await getAdminErrorLogs(params?.page, params?.limit, params?.level);
      return response;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch error logs");
    }
  }
);

export const clearAllErrorLogs = createAsyncThunk(
  "errorLogs/clearAllErrorLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClearAllErrorLogs();
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to clear error logs");
    }
  }
);

export const bulkDeleteErrorLogs = createAsyncThunk(
  "errorLogs/bulkDeleteErrorLogs",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const response = await apiBulkDeleteErrorLogs(ids);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to bulk delete error logs");
    }
  }
);


export const errorLogsSlice = createSlice({
  name: "errorLogs",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setErrorLogs: (state, action: PayloadAction<{ logs: ErrorLog[]; meta: ErrorLogsState["meta"] }>) => {
      state.errorLogs = action.payload.logs;
      state.meta = action.payload.meta;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAdminErrorLogs
      .addCase(fetchAdminErrorLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminErrorLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorLogs = action.payload.data;
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchAdminErrorLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // clearAllErrorLogs
      .addCase(clearAllErrorLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearAllErrorLogs.fulfilled, (state) => {
        state.isLoading = false;
        state.errorLogs = [];
        state.meta = null;
      })
      .addCase(clearAllErrorLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // bulkDeleteErrorLogs
      .addCase(bulkDeleteErrorLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkDeleteErrorLogs.fulfilled, (state) => {
        state.isLoading = false;
        // In a real scenario, we might filter out the deleted IDs from state.errorLogs here.
        // For now, simply clear the loading state.
      })
      .addCase(bulkDeleteErrorLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, setErrorLogs } = errorLogsSlice.actions;
export default errorLogsSlice.reducer;
