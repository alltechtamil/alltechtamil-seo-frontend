import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminTags,
  createTag as apiCreateTag,
  updateTag as apiUpdateTag,
  deleteTag as apiDeleteTag,
} from "../../lib/api/admin/tags.api";
import { getPublicTags } from "../../lib/api/public/tags.api";
import { Tag, CreateTagPayload, UpdateTagPayload } from "../../types/tag.types";

export interface TagsState {
  adminTags: Tag[];
  publicTags: Tag[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  adminTags: [],
  publicTags: [],
  isLoading: false,
  error: null,
};

export const fetchAdminTags = createAsyncThunk(
  "tags/fetchAdminTags",
  async (popular: boolean | undefined, { rejectWithValue }) => {
    try {
      const response = await getAdminTags(popular);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch tags");
    }
  }
);

export const fetchPublicTags = createAsyncThunk(
  "tags/fetchPublicTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPublicTags();
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch public tags");
    }
  }
);

export const createTag = createAsyncThunk(
  "tags/createTag",
  async (payload: CreateTagPayload, { rejectWithValue }) => {
    try {
      const response = await apiCreateTag(payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create tag");
    }
  }
);

export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ id, payload }: { id: string; payload: UpdateTagPayload }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateTag(id, payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update tag");
    }
  }
);

export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteTag(id);
      return id;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to delete tag");
    }
  }
);

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAdminTags
      .addCase(fetchAdminTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminTags = action.payload;
      })
      .addCase(fetchAdminTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchPublicTags
      .addCase(fetchPublicTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicTags = action.payload;
      })
      .addCase(fetchPublicTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // createTag
      .addCase(createTag.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminTags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateTag
      .addCase(updateTag.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.adminTags.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.adminTags[index] = action.payload;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // deleteTag
      .addCase(deleteTag.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminTags = state.adminTags.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default tagsSlice.reducer;
