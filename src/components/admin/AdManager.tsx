"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAdminAds,
  createAd,
  updateAd,
  deleteAd
} from '@/store/slices/adsSlice';
import { AdUnit, AdPlacement, DeviceTarget } from '@/types/ad.types';
import { useToast } from '@/context/ToastContext';
import { ConfirmDialog } from './ConfirmDialog';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  Code2,
  MonitorSmartphone,
  LayoutTemplate
} from 'lucide-react';

const PLACEMENT_OPTIONS: AdPlacement[] = [
  "HOME_TOP", "HOME_MIDDLE", "HOME_BOTTOM",
  "SEARCH_TOP", "SEARCH_INLINE", "SEARCH_BOTTOM",
  "BLOG_TOP", "BLOG_INLINE_1", "BLOG_INLINE_2", "BLOG_BOTTOM", "BLOG_SIDEBAR"
];

const DEVICE_OPTIONS: { value: DeviceTarget; label: string }[] = [
  { value: "all", label: "All Devices (Responsive)" },
  { value: "desktop", label: "Desktop Only" },
  { value: "mobile", label: "Mobile Only" }
];

export function AdManager() {
  const dispatch = useAppDispatch();
  const { adminAds, isLoading } = useAppSelector((state) => state.ads);
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    name: string;
    placement: AdPlacement;
    ad_script: string;
    device_target: DeviceTarget;
    sort_order: number;
    is_active: boolean;
  }>({
    name: '',
    placement: 'BLOG_INLINE_1',
    ad_script: '',
    device_target: 'all',
    sort_order: 0,
    is_active: true,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminAds());
  }, [dispatch]);

  const handleStartCreate = () => {
    setFormData({
      name: '',
      placement: 'BLOG_INLINE_1',
      ad_script: '',
      device_target: 'all',
      sort_order: adminAds.length > 0 ? Math.max(...adminAds.map(a => a.sortOrder)) + 1 : 0,
      is_active: true,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (ad: AdUnit) => {
    setFormData({
      name: ad.name,
      placement: ad.placement,
      ad_script: ad.adScript,
      device_target: ad.deviceTarget,
      sort_order: ad.sortOrder,
      is_active: ad.isActive,
    });
    setEditingId(ad.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Ad name is required');
      return;
    }
    if (!formData.ad_script.trim()) {
      toast.error('Ad script content is required');
      return;
    }

    try {
      if (editingId === null) {
        await dispatch(createAd({
          name: formData.name.trim(),
          placement: formData.placement,
          ad_script: formData.ad_script.trim(),
          device_target: formData.device_target,
          sort_order: formData.sort_order,
          is_active: formData.is_active
        })).unwrap();
        toast.success('Ad unit created successfully');
      } else {
        await dispatch(updateAd({
          id: editingId,
          payload: {
            name: formData.name.trim(),
            placement: formData.placement,
            ad_script: formData.ad_script.trim(),
            device_target: formData.device_target,
            sort_order: formData.sort_order,
            is_active: formData.is_active
          }
        })).unwrap();
        toast.success('Ad unit updated successfully');
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleToggleActive = async (ad: AdUnit) => {
    try {
      await dispatch(updateAd({
        id: ad.id,
        payload: { is_active: !ad.isActive }
      })).unwrap();
      toast.success(`Ad unit ${!ad.isActive ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      toast.error(err || 'Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await dispatch(deleteAd(deleteConfirmId)).unwrap();
      toast.success('Ad unit permanently deleted');
    } catch (err: any) {
      toast.error(err || 'Failed to delete ad');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Sort ads primarily by placement, then by sortOrder
  const sortedAds = [...adminAds].sort((a, b) => {
    if (a.placement !== b.placement) return a.placement.localeCompare(b.placement);
    return a.sortOrder - b.sortOrder;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-primary" />
            Ad Inventory
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage banner placements, injected scripts, and responsive targeting.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-on-primary font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-60 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Ad Unit</span>
        </button>
      </div>

      {/* Main List Area */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {isLoading && sortedAds.length === 0 ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedAds.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <Code2 className="w-8 h-8 text-on-surface-variant/50" />
            </div>
            <h3 className="font-bold text-on-surface text-base">No Ad Units Configured</h3>
            <p className="text-xs text-on-surface-variant mt-1 mb-6 max-w-sm">
              Inject AdSense, custom HTML, or sponsor banners seamlessly into your layout.
            </p>
            <button
              onClick={handleStartCreate}
              className="px-6 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs rounded-xl transition-colors"
            >
              Deploy First Ad Unit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Unit Name</th>
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Placement</th>
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Target</th>
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                  <th className="py-3 px-6 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {sortedAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-surface-container-low/20 transition-colors group">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-sm text-on-surface">{ad.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-mono mt-0.5 truncate max-w-[200px]" title={ad.adScript}>
                          {ad.adScript.substring(0, 40)}{ad.adScript.length > 40 ? '...' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {ad.placement}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded-md uppercase">
                        <MonitorSmartphone className="w-3.5 h-3.5" />
                        {ad.deviceTarget}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(ad)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors border ${
                          ad.isActive 
                            ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10'
                            : 'bg-on-surface-variant/5 text-on-surface-variant border-outline-variant/20 hover:bg-on-surface-variant/10'
                        }`}
                      >
                        {ad.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(ad)}
                          className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-xl transition-colors"
                          title="Edit Ad Unit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(ad.id)}
                          className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl transition-colors"
                          title="Delete Ad Unit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Ad Unit"
        message="Are you sure you want to permanently delete this ad configuration? It will immediately stop rendering on the public site."
        confirmText="Yes, Delete Ad"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={handleCloseModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          />
          <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-outline-variant/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[scaleUp_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
            
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/30">
              <h3 className="font-extrabold text-lg text-on-surface">
                {editingId ? 'Edit Ad Unit' : 'Create Ad Unit'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container rounded-xl transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Internal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Header Leaderboard AdSense"
                    className="w-full px-4 py-2.5 text-sm bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                  <div className="flex items-center h-[42px] px-4 bg-surface-container border border-outline-variant/40 rounded-xl">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.is_active}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-primary' : 'bg-on-surface-variant/30'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-bold text-on-surface">
                        {formData.is_active ? 'Active (Live)' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Layout Placement</label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData(prev => ({ ...prev, placement: e.target.value as AdPlacement }))}
                    className="w-full px-4 py-2.5 text-sm font-mono font-bold bg-surface-container border border-outline-variant/40 rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {PLACEMENT_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Device Target</label>
                  <select
                    value={formData.device_target}
                    onChange={(e) => setFormData(prev => ({ ...prev, device_target: e.target.value as DeviceTarget }))}
                    className="w-full px-4 py-2.5 text-sm font-bold bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                  >
                    {DEVICE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">HTML/JS Ad Script</label>
                  <span className="text-[10px] text-on-surface-variant font-mono">Rendered dangerously via dangerouslySetInnerHTML</span>
                </div>
                <textarea
                  value={formData.ad_script}
                  onChange={(e) => setFormData(prev => ({ ...prev, ad_script: e.target.value }))}
                  placeholder="<!-- Paste your AdSense, Mediavine, or custom banner script here -->"
                  className="w-full h-48 px-4 py-3 text-sm font-mono bg-surface-container-highest border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none whitespace-pre"
                  spellCheck={false}
                />
              </div>

            </div>

            <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-end gap-3 bg-surface-container-low/30">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl border border-outline hover:bg-surface-container text-xs font-extrabold text-on-surface-variant transition-all active:scale-97 cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-primary hover:bg-primary/95 shadow-md shadow-primary/25 transition-all active:scale-97 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {editingId ? 'Update Ad Unit' : 'Deploy Ad Unit'}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
