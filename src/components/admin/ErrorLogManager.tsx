"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAdminErrorLogs,
  clearAllErrorLogs,
  bulkDeleteErrorLogs
} from '@/store/slices/errorLogsSlice';
import { ErrorLog, ErrorSeverity } from '@/types/error-log.types';
import { useToast } from '@/context/ToastContext';
import { ConfirmDialog } from './ConfirmDialog';
import { 
  Trash2, 
  AlertOctagon, 
  Search, 
  Terminal, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  ServerCrash
} from 'lucide-react';

export function ErrorLogManager() {
  const dispatch = useAppDispatch();
  const { errorLogs, meta, isLoading } = useAppSelector((state) => state.errorLogs);
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingLog, setViewingLog] = useState<ErrorLog | null>(null);
  
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminErrorLogs({ page, limit: 15 }));
  }, [dispatch, page]);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === errorLogs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(errorLogs.map(log => log.id)));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteErrorLogs(Array.from(selectedIds))).unwrap();
      toast.success(`${selectedIds.size} logs deleted successfully`);
      setSelectedIds(new Set());
      dispatch(fetchAdminErrorLogs({ page, limit: 15 }));
    } catch (err: any) {
      toast.error(err || 'Failed to delete selected logs');
    } finally {
      setIsBulkDeleteConfirmOpen(false);
    }
  };

  const handleClearAll = async () => {
    try {
      await dispatch(clearAllErrorLogs()).unwrap();
      toast.success('All error telemetry has been purged');
      setPage(1);
      dispatch(fetchAdminErrorLogs({ page: 1, limit: 15 }));
    } catch (err: any) {
      toast.error(err || 'Failed to clear all logs');
    } finally {
      setIsClearAllConfirmOpen(false);
    }
  };

  const getSeverityStyles = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'FATAL':
      case 'CRITICAL':
        return 'bg-error/10 text-error border-error/20';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'LOW':
      default:
        return 'bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/20';
    }
  };

  return (
    <div className="space-y-6 select-none relative">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            System Diagnostic Telemetry
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Monitor uncaught exceptions, API failures, and backend panics.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button
              onClick={() => setIsBulkDeleteConfirmOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-error hover:bg-error/95 text-white font-bold text-sm rounded-xl transition-all active:scale-95 shadow-sm animate-[fadeIn_0.2s_ease-out]"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedIds.size})</span>
            </button>
          )}

          <button
            onClick={() => setIsClearAllConfirmOpen(true)}
            disabled={isLoading || errorLogs.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-error/50 text-error hover:bg-error/10 font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Purge All</span>
          </button>
        </div>
      </div>

      {/* Main List Area */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {isLoading && errorLogs.length === 0 ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : errorLogs.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <ServerCrash className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-bold text-on-surface text-base">System is Healthy</h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm">
              There are no backend exceptions or operational errors recorded in the telemetry database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20">
                  <th className="py-3 px-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.size === errorLogs.length && errorLogs.length > 0}
                      onChange={toggleAll}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Severity</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Error Details</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Request Path</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                  <th className="py-3 px-4 font-bold text-[10px] text-on-surface-variant uppercase tracking-wider text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {errorLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-surface-container-low/20 transition-colors group cursor-pointer ${
                      selectedIds.has(log.id) ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => toggleSelection(log.id)}
                  >
                    <td className="py-4 px-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(log.id)}
                        onChange={() => {}} // handled by row click
                        className="rounded border-outline-variant text-primary focus:ring-primary pointer-events-none"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-wider ${getSeverityStyles(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-sm text-on-surface truncate max-w-[250px]" title={log.errorMessage}>
                        {log.errorMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-on-surface-variant">
                        {log.errorCode && <span className="bg-surface-container px-1 py-0.5 rounded">{log.errorCode}</span>}
                        {log.errorType && <span>{log.errorType}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {log.requestMethod && (
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                            {log.requestMethod}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-on-surface truncate max-w-[150px]" title={log.requestUrl || 'Unknown'}>
                          {log.requestUrl || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-on-surface-variant">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingLog(log);
                        }}
                        className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-xl transition-colors"
                        title="View Full Stack Trace"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-outline-variant/20 bg-surface-container-low/10">
                <span className="text-xs font-bold text-on-surface-variant">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={meta.page <= 1 || isLoading}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1.5 rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={meta.page >= meta.totalPages || isLoading}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1.5 rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isBulkDeleteConfirmOpen}
        title="Delete Selected Logs"
        message={`Are you sure you want to permanently delete these ${selectedIds.size} error logs?`}
        confirmText="Yes, Delete Logs"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleBulkDelete}
        onCancel={() => setIsBulkDeleteConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={isClearAllConfirmOpen}
        title="Purge Telemetry Database"
        message="DANGER: Are you sure you want to permanently delete ALL error logs? This will wipe the entire diagnostics table and cannot be undone."
        confirmText="Yes, Purge Everything"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleClearAll}
        onCancel={() => setIsClearAllConfirmOpen(false)}
      />

      {/* Stack Trace / Detail Modal */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setViewingLog(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          />
          <div className="relative w-full max-w-4xl bg-surface-container-lowest border border-outline-variant/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[scaleUp_0.25s_cubic-bezier(0.34,1.56,0.64,1)] text-left select-text">
            
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/30">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-wider ${getSeverityStyles(viewingLog.severity)}`}>
                  {viewingLog.severity}
                </span>
                <h3 className="font-extrabold text-base text-on-surface truncate">
                  Error Details: {viewingLog.errorCode || viewingLog.errorType}
                </h3>
              </div>
              <button
                onClick={() => setViewingLog(null)}
                className="p-1.5 text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container rounded-xl transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-surface">
              
              {/* Message Banner */}
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl">
                <p className="font-bold text-sm text-error font-mono break-all">
                  {viewingLog.errorMessage}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl">
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Timestamp</span>
                  <span className="text-xs font-mono text-on-surface">{new Date(viewingLog.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Correlation ID</span>
                  <span className="text-xs font-mono text-on-surface">{viewingLog.correlationId || '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">IP Address</span>
                  <span className="text-xs font-mono text-on-surface">{viewingLog.ipAddress || '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">User ID</span>
                  <span className="text-xs font-mono text-on-surface">{viewingLog.userId || '-'}</span>
                </div>
                <div className="col-span-2 md:col-span-4 mt-2">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Request Endpoint</span>
                  <span className="text-xs font-mono text-on-surface">
                    {viewingLog.requestMethod ? `[${viewingLog.requestMethod}] ` : ''}
                    {viewingLog.requestUrl || 'Internal'}
                  </span>
                </div>
              </div>

              {/* Stack Trace */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Raw Stack Trace</span>
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-outline-variant/30">
                  <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10">
                    <span className="text-[10px] font-mono text-white/50">Node.js Exception</span>
                    {viewingLog.fileName && (
                      <span className="text-[10px] font-mono text-white/50">{viewingLog.fileName} {viewingLog.functionName ? `-> ${viewingLog.functionName}()` : ''}</span>
                    )}
                  </div>
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono text-red-400/90 leading-relaxed whitespace-pre-wrap">
                    {viewingLog.stackTrace || 'No stack trace available.'}
                  </pre>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
