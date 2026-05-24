"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAdminTags,
  createTag,
  updateTag,
  deleteTag
} from '@/store/slices/tagsSlice';
import { Tag } from '@/types/tag.types';
import { useToast } from '@/context/ToastContext';
import { ConfirmDialog } from './ConfirmDialog';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  Hash
} from 'lucide-react';

export function TagManager() {
  const dispatch = useAppDispatch();
  const { adminTags, isLoading } = useAppSelector((state) => state.tags);
  const toast = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminTags(false)); // fetch all tags
  }, [dispatch]);

  const handleStartCreate = () => {
    setFormData({ name: '' });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (tag: Tag) => {
    setFormData({ name: tag.name });
    setEditingId(tag.id);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Tag name is required');
      return;
    }

    try {
      if (isCreating) {
        await dispatch(createTag({
          name: formData.name.trim(),
        })).unwrap();
        toast.success('Tag created successfully');
      } else if (editingId) {
        await dispatch(updateTag({
          id: editingId,
          payload: {
            name: formData.name.trim(),
          }
        })).unwrap();
        toast.success('Tag updated successfully');
      }
      handleCancel();
    } catch (err: any) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await dispatch(deleteTag(deleteConfirmId)).unwrap();
      toast.success('Tag permanently deleted');
    } catch (err: any) {
      toast.error(err || 'Failed to delete tag');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Sort tags alphabetically for the manager
  const sortedTags = [...adminTags].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6 select-none">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Taxonomy Tags
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage granular keywords to help users filter and find specific content.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          disabled={isCreating || isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Tag</span>
        </button>
      </div>

      {/* Main List Area */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {isLoading && sortedTags.length === 0 ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedTags.length === 0 && !isCreating ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <Hash className="w-8 h-8 text-on-surface-variant/50" />
            </div>
            <h3 className="font-bold text-on-surface text-base">No tags created yet</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-6 max-w-sm">
              Tags are usually created automatically when writing blogs, but you can pre-define them here.
            </p>
            <button
              onClick={handleStartCreate}
              className="px-6 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl transition-colors"
            >
              Create Your First Tag
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Tag Details</th>
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Created At</th>
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Usage Count</th>
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                
                {/* Inline Creation Form */}
                {isCreating && (
                  <tr className="bg-primary/5 animate-[fadeIn_0.2s_ease-out]">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-primary shrink-0" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ name: e.target.value })}
                          placeholder="Tag Name (e.g. React)"
                          className="w-full max-w-xs px-3 py-1.5 text-sm bg-surface-container border border-primary/40 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-on-surface-variant/40 font-bold"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-on-surface-variant font-mono">
                      Just now
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-on-surface-variant font-mono">
                      0
                    </td>
                    <td className="py-4 px-6 text-right">
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
                          title="Save Tag"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Tags Map */}
                {sortedTags.map((tag) => {
                  const isEditing = editingId === tag.id;
                  
                  if (isEditing) {
                    return (
                      <tr key={tag.id} className="bg-primary/5 animate-[fadeIn_0.2s_ease-out]">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Hash className="w-4 h-4 text-primary shrink-0" />
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ name: e.target.value })}
                              className="w-full max-w-xs px-3 py-1.5 text-sm bg-surface-container border border-primary/40 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center text-xs text-on-surface-variant font-mono">
                          {new Date(tag.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-center text-xs text-on-surface-variant font-mono">
                          {tag.blogsCount || 0}
                        </td>
                        <td className="py-4 px-6 text-right">
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
                              title="Update Tag"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={tag.id} className="hover:bg-surface-container-low/20 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Hash className="w-4 h-4 text-on-surface-variant/50 shrink-0" />
                          <div>
                            <p className="font-bold text-sm text-on-surface">{tag.name}</p>
                            <span className="text-[10px] text-on-surface-variant font-mono bg-surface-container px-1.5 py-0.5 rounded mt-0.5 inline-block">
                              /{tag.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-xs font-mono text-on-surface-variant">
                        {new Date(tag.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-center text-xs font-bold text-on-surface">
                        <span className={`px-2 py-1 rounded-md bg-surface-container ${
                          (tag.blogsCount || 0) > 0 ? 'text-primary' : 'text-on-surface-variant'
                        }`}>
                          {tag.blogsCount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(tag)}
                            className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-xl transition-colors"
                            title="Edit Tag"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(tag.id)}
                            className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl transition-colors"
                            title="Delete Tag"
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
        title="Delete Tag"
        message="Are you sure you want to permanently delete this tag? This action cannot be undone, and it will be removed from all associated blog posts."
        confirmText="Yes, Delete Tag"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
