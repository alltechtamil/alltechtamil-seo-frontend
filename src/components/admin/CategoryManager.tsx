"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/store/slices/categoriesSlice';
import { Category } from '@/types/category.types';
import { useToast } from '@/context/ToastContext';
import { ConfirmDialog } from './ConfirmDialog';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  GripVertical,
  Layers,
  FolderOpen
} from 'lucide-react';

export function CategoryManager() {
  const dispatch = useAppDispatch();
  const { adminCategories, isLoading } = useAppSelector((state) => state.categories);
  const toast = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  // Local state for optimistic drag-and-drop sorting
  const [localCategories, setLocalCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminCategories(true)); // Pass true to includeInactive
  }, [dispatch]);

  // Sync Redux state to local state when not dragging
  useEffect(() => {
    if (!draggedId) {
      setLocalCategories([...adminCategories].sort((a, b) => a.sortOrder - b.sortOrder));
    }
  }, [adminCategories, draggedId]);

  const handleStartCreate = () => {
    setFormData({
      name: '',
      description: '',
      sortOrder: adminCategories.length > 0 
        ? Math.max(...adminCategories.map(c => c.sortOrder)) + 1 
        : 0,
      isActive: true,
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setEditingId(category.id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (isCreating) {
        await dispatch(createCategory({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          sortOrder: formData.sortOrder,
          isActive: formData.isActive
        })).unwrap();
        toast.success('Category created successfully');
      } else if (editingId) {
        await dispatch(updateCategory({
          id: editingId,
          payload: {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            sortOrder: formData.sortOrder,
            isActive: formData.isActive
          }
        })).unwrap();
        toast.success('Category updated successfully');
      }
      handleCancel();
    } catch (err: any) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await dispatch(updateCategory({
        id: category.id,
        payload: { isActive: !category.isActive }
      })).unwrap();
      toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`);
    } catch (err: any) {
      toast.error(err || 'Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await dispatch(deleteCategory(deleteConfirmId)).unwrap();
      toast.success('Category permanently deleted');
    } catch (err: any) {
      toast.error(err || 'Failed to delete category');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image fallback
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const oldIndex = localCategories.findIndex(c => c.id === draggedId);
    const newIndex = localCategories.findIndex(c => c.id === targetId);
    
    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically reorder list while dragging
    const newItems = [...localCategories];
    const [removed] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, removed);
    setLocalCategories(newItems);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    if (!draggedId) return;

    const itemsToUpdate = localCategories.map((item, index) => ({
      ...item,
      newSortOrder: index // Base 0 indexing for sort order
    })).filter(item => item.sortOrder !== item.newSortOrder);

    setDraggedId(null);

    if (itemsToUpdate.length === 0) return;

    try {
      // Fire updates in parallel for items that changed order
      await Promise.all(
        itemsToUpdate.map(item => 
          dispatch(updateCategory({
            id: item.id,
            payload: { sortOrder: item.newSortOrder }
          })).unwrap()
        )
      );
      toast.success('Categories reordered');
    } catch (error: any) {
      toast.error(error || 'Failed to save new order');
      // Revert to server state on error
      setLocalCategories([...adminCategories].sort((a, b) => a.sortOrder - b.sortOrder));
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            Taxonomy Categories
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Organize your editorial content into high-level content buckets.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          disabled={isCreating || isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Main List Area */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {isLoading && localCategories.length === 0 ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : localCategories.length === 0 && !isCreating ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-on-surface-variant/50" />
            </div>
            <h3 className="font-bold text-on-surface text-base">No categories configured</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-6 max-w-sm">
              Create broad topics to organize your content. Categories help users navigate your site logically.
            </p>
            <button
              onClick={handleStartCreate}
              className="px-6 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl transition-colors"
            >
              Create Your First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-3 px-4 w-12"></th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Details</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Sort</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Blogs</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                
                {/* Inline Creation Form */}
                {isCreating && (
                  <tr className="bg-primary/5 animate-[fadeIn_0.2s_ease-out]">
                    <td className="py-4 px-4 text-center">
                      <Plus className="w-4 h-4 text-primary inline-block" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2 max-w-md">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Category Name (e.g. Technology)"
                          className="w-full px-3 py-1.5 text-sm bg-surface-container border border-primary/40 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-on-surface-variant/40 font-bold"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Optional short description..."
                          className="w-full px-3 py-1.5 text-xs bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder-on-surface-variant/40"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        className="w-16 px-2 py-1.5 text-center text-sm bg-surface-container border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          formData.isActive 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-on-surface-variant/10 text-on-surface-variant border border-outline-variant/20'
                        }`}
                      >
                        {formData.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center text-xs text-on-surface-variant font-mono">
                      0
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={handleCancel}
                          className="p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-error rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg transition-colors disabled:opacity-50"
                          title="Save Category"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Categories Map */}
                {localCategories.map((category) => {
                  const isEditing = editingId === category.id;
                  const isDragged = draggedId === category.id;
                  
                  if (isEditing) {
                    return (
                      <tr key={category.id} className="bg-primary/5 animate-[fadeIn_0.2s_ease-out]">
                        <td className="py-4 px-4 text-center">
                          <Edit2 className="w-4 h-4 text-primary inline-block" />
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2 max-w-md">
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-1.5 text-sm bg-surface-container border border-primary/40 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                              autoFocus
                            />
                            <input
                              type="text"
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Optional short description..."
                              className="w-full px-3 py-1.5 text-xs bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <input
                            type="number"
                            value={formData.sortOrder}
                            onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                            className="w-16 px-2 py-1.5 text-center text-sm bg-surface-container border border-outline-variant/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20"
                          />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                              formData.isActive 
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : 'bg-on-surface-variant/10 text-on-surface-variant border border-outline-variant/20'
                            }`}
                          >
                            {formData.isActive ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-center text-xs text-on-surface-variant font-mono">
                          {category.blogsCount || 0}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={handleCancel}
                              className="p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-error rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={isLoading}
                              className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg transition-colors disabled:opacity-50"
                              title="Update Category"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr 
                      key={category.id} 
                      draggable={!editingId}
                      onDragStart={(e) => handleDragStart(e, category.id)}
                      onDragOver={(e) => handleDragOver(e, category.id)}
                      onDrop={handleDrop}
                      onDragEnd={() => setDraggedId(null)}
                      className={`hover:bg-surface-container-low/20 transition-all group ${
                        isDragged ? 'opacity-50 scale-[0.99] bg-surface-container-low' : 'opacity-100'
                      }`}
                    >
                      <td className="py-4 px-4 text-center text-on-surface-variant/40 hover:text-primary cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 inline-block pointer-events-none" />
                      </td>
                      <td className="py-4 px-4 pointer-events-none">
                        <div>
                          <p className="font-bold text-sm text-on-surface">{category.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-on-surface-variant font-mono bg-surface-container px-1.5 py-0.5 rounded">
                              /{category.slug}
                            </span>
                            {category.description && (
                              <span className="text-[10px] text-on-surface-variant truncate max-w-[200px]" title={category.description}>
                                {category.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center pointer-events-none">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-container text-xs font-mono font-bold text-on-surface-variant">
                          {category.sortOrder}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(category)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors border ${
                            category.isActive 
                              ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10'
                              : 'bg-on-surface-variant/5 text-on-surface-variant border-outline-variant/20 hover:bg-on-surface-variant/10'
                          }`}
                        >
                          {category.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center text-xs font-bold text-on-surface pointer-events-none">
                        {category.blogsCount || 0}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-xl transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(category.id)}
                            className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Category"
        message="Are you sure you want to permanently delete this category? This action cannot be undone, and any blogs associated with it may lose their categorization."
        confirmText="Yes, Delete Category"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
