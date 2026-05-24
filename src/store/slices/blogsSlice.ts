import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminBlogs,
  getAdminBlog,
  getAdminBlogBySlug,
  createBlog as apiCreateBlog,
  updateBlog as apiUpdateBlog,
  deleteBlog as apiDeleteBlog,
  updateBlogStatus as apiUpdateBlogStatus,
} from "../../lib/api/admin/blogs.api";
import {
  getPublicBlogs,
  getPublicBlogBySlug,
} from "../../lib/api/public/blogs.api";
import { Blog, BlogListItem, BlogFilterParams, CreateBlogPayload, UpdateBlogPayload, BlogStatus } from "../../types/blog.types";

export interface BlogsState {
  adminBlogs: BlogListItem[];
  publicBlogs: BlogListItem[];
  currentBlog: Blog | null;
  adminMeta: unknown | null;
  publicMeta: unknown | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BlogsState = {
  adminBlogs: [],
  publicBlogs: [],
  currentBlog: null,
  adminMeta: null,
  publicMeta: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchAdminBlogs = createAsyncThunk(
  "blogs/fetchAdminBlogs",
  async (params: BlogFilterParams | undefined, { rejectWithValue }) => {
    try {
      const response = await getAdminBlogs(params);
      return response;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);

export const fetchAdminBlogById = createAsyncThunk(
  "blogs/fetchAdminBlogById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getAdminBlog(id);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch blog");
    }
  }
);

export const fetchAdminBlogBySlug = createAsyncThunk(
  "blogs/fetchAdminBlogBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await getAdminBlogBySlug(slug);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch blog by slug");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (payload: CreateBlogPayload, { rejectWithValue }) => {
    try {
      const response = await apiCreateBlog(payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, payload }: { id: string; payload: UpdateBlogPayload }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateBlog(id, payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteBlog(id);
      return id;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to delete blog");
    }
  }
);

export const updateBlogStatus = createAsyncThunk(
  "blogs/updateBlogStatus",
  async (
    { id, status, publishedAt }: { id: string; status: BlogStatus; publishedAt?: string | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiUpdateBlogStatus(id, status, publishedAt);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update status");
    }
  }
);

export const fetchPublicBlogs = createAsyncThunk(
  "blogs/fetchPublicBlogs",
  async (params: BlogFilterParams | undefined, { rejectWithValue }) => {
    try {
      const response = await getPublicBlogs(params);
      return response;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch public blogs");
    }
  }
);

export const fetchPublicBlogBySlug = createAsyncThunk(
  "blogs/fetchPublicBlogBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await getPublicBlogBySlug(slug);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch public blog by slug");
    }
  }
);

export const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAdminBlogs
      .addCase(fetchAdminBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminBlogs = action.payload.data;
        state.adminMeta = action.payload.meta;
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchAdminBlogById
      .addCase(fetchAdminBlogById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchAdminBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchAdminBlogBySlug
      .addCase(fetchAdminBlogBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchAdminBlogBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // createBlog
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateBlog
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
        // Also optionally update it in the list if it exists
        const index = state.adminBlogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.adminBlogs[index] = { ...state.adminBlogs[index], ...action.payload };
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // deleteBlog
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminBlogs = state.adminBlogs.filter((b) => b.id !== action.payload);
        if (state.currentBlog?.id === action.payload) {
          state.currentBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateBlogStatus
      .addCase(updateBlogStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlogStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentBlog?.id === action.payload.id) {
          state.currentBlog.status = action.payload.status;
        }
        const index = state.adminBlogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.adminBlogs[index].status = action.payload.status;
        }
      })
      .addCase(updateBlogStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchPublicBlogs
      .addCase(fetchPublicBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicBlogs = action.payload.data;
        state.publicMeta = action.payload.meta;
      })
      .addCase(fetchPublicBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchPublicBlogBySlug
      .addCase(fetchPublicBlogBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicBlogBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchPublicBlogBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentBlog, clearError } = blogsSlice.actions;
export default blogsSlice.reducer;
