import React from 'react';
import { Project } from '../../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeletePlanModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  project,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Delete Plan?
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              "{project.title}"
            </span>
            ? This will remove all associated cards, tasks, notes, connections, and whiteboard drawings.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
            This action cannot be undone. All data for this plan will be removed from your workspace.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
