import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { exportProjectToJson, exportAllProjectsToJson } from '../../utils/storage';
import { X, Download, Upload, RefreshCw, FileCheck, AlertCircle } from 'lucide-react';
import { TEMPLATES } from '../../data/templates';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const { projects, activeProject, importProject } = useProjectContext();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportStatus('Reading file...');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (parsed && typeof parsed === 'object') {
          // Check if single project or array
          if (Array.isArray(parsed)) {
            parsed.forEach((p) => importProject(p));
            setImportStatus(`Successfully imported ${parsed.length} workspaces!`);
          } else if (parsed.nodes && parsed.title) {
            importProject(parsed);
            setImportStatus(`Successfully imported "${parsed.title}"!`);
          } else {
            throw new Error('Unrecognized PLXN project schema.');
          }

          setTimeout(() => {
            onClose();
          }, 1200);
        }
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON file.');
        setImportStatus(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Data Management & Backup
            </h2>
            <p className="text-xs text-neutral-500">Offline-first local storage JSON sync</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Export Current Project */}
          {activeProject && (
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Export Current Plan
                </span>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Save "{activeProject.title}" as a JSON file
                </p>
              </div>
              <button
                onClick={() => exportProjectToJson(activeProject)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          )}

          {/* Export All Projects */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Backup All Plans ({projects.length})
              </span>
              <p className="text-neutral-500 text-[11px] mt-0.5">
                Download all workspaces in a single JSON backup
              </p>
            </div>
            <button
              onClick={() => exportAllProjectsToJson(projects)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-3.5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 space-y-2">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
              Import Workspace (.json)
            </span>
            <p className="text-neutral-500 text-[11px]">
              Restore an exported PLXN file into your browser's local database.
            </p>

            <label className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer font-medium transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Select JSON File</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {importStatus && (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{importStatus}</span>
              </div>
            )}

            {importError && (
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{importError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
