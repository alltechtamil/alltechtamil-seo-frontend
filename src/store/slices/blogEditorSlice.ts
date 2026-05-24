import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BlogEditorState {
  isDirty: boolean;
  currentBlogId: number | null;
}

const initialState: BlogEditorState = {
  isDirty: false,
  currentBlogId: null,
};

export const blogEditorSlice = createSlice({
  name: "blogEditor",
  initialState,
  reducers: {
    setDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    setCurrentBlogId: (state, action: PayloadAction<number | null>) => {
      state.currentBlogId = action.payload;
    },
    clearEditor: (state) => {
      state.isDirty = false;
      state.currentBlogId = null;
    },
  },
});

export const { setDirty, setCurrentBlogId, clearEditor } = blogEditorSlice.actions;
export default blogEditorSlice.reducer;
