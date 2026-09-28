import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { TEMPLATES } from '../../data/templates';
import { X, Sparkles, ArrowRight, Layout, Rocket, Kanban, Feather, Calendar } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Kanban,
  Feather,
  Calendar,
};

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProjectContext();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (templateId?: string) => {
    createProject(templateId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Create a New Plan
            </h2>
            <p className="text-xs text-neutral-500">
              Choose a starter framework or open a blank workflow canvas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Blank Canvas Option */}
          <div
            onClick={() => handleCreate()}
            className="group flex items-center justify-between p-4 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-300 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:scale-105 transition-transform">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Blank Workflow Canvas
                </h3>
                <p className="text-xs text-neutral-500">
                  Clean 2D infinite workspace for custom diagrams, mind maps, and pipelines.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Section Divider */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Or Start With a Prebuilt Framework
            </span>
            <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
          </div>

          {/* Prebuilt Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((tmpl) => {
              const IconComp = ICON_MAP[tmpl.icon] || Sparkles;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleCreate(tmpl.id)}
                  className="group p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/30 dark:bg-neutral-900/30 hover:bg-white dark:hover:bg-[#1E1E22] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: tmpl.color }}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {tmpl.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                      {tmpl.name}
                    </h4>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs font-medium text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
