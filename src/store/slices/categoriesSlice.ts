import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminCategories,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "../../lib/api/admin/categories.api";
import { getPublicCategories } from "../../lib/api/public/categories.api";
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../../types/category.types";

export interface CategoriesState {
  adminCategories: Category[];
  publicCategories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  adminCategories: [],
  publicCategories: [],
  isLoading: false,
  error: null,
};

export const fetchAdminCategories = createAsyncThunk(
  "categories/fetchAdminCategories",
  async (includeInactive: boolean | undefined, { rejectWithValue }) => {
    try {
      const response = await getAdminCategories(includeInactive);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

export const fetchPublicCategories = createAsyncThunk(
  "categories/fetchPublicCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPublicCategories();
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch public categories");
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (payload: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      const response = await apiCreateCategory(payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, payload }: { id: string; payload: UpdateCategoryPayload }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateCategory(id, payload);
      return response.data;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeleteCategory(id);
      return id;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to delete category");
    }
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAdminCategories
      .addCase(fetchAdminCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminCategories = action.payload;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchPublicCategories
      .addCase(fetchPublicCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicCategories = action.payload;
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // createCategory
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminCategories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.adminCategories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.adminCategories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminCategories = state.adminCategories.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default categoriesSlice.reducer;
