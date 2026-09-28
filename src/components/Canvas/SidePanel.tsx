import React, { useState } from 'react';
import { Project } from '../../types';
import { useProjectContext } from '../../context/ProjectContext';
import { 
  X, 
  Tag, 
  FileText, 
  History, 
  BarChart2, 
  CheckCircle2, 
  Flag, 
  Plus, 
  Clock 
} from 'lucide-react';

interface SidePanelProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ project, isOpen, onClose }) => {
  const { updateProjectMeta } = useProjectContext();
  const [activeTab, setActiveTab] = useState<'notes' | 'tags' | 'activity' | 'stats'>('notes');
  const [newTagInput, setNewTagInput] = useState('');

  if (!isOpen) return null;

  // Stats calculations
  const totalNodes = project.nodes.length;
  const taskNodes = project.nodes.filter((n) => n.type === 'task');
  const completedTasks = taskNodes.filter((n) => n.status === 'done').length;
  const milestoneNodes = project.nodes.filter((n) => n.type === 'milestone');
  const achievedMilestones = milestoneNodes.filter(
    (m) => m.milestoneStatus === 'achieved' || (m.progress && m.progress >= 100)
  ).length;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateProjectMeta(project.id, { notes: e.target.value });
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim();
    if (!project.tags.includes(clean)) {
      updateProjectMeta(project.id, { tags: [...project.tags, clean] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateProjectMeta(project.id, {
      tags: project.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <aside className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-white/95 dark:bg-[#18181C]/95 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl backdrop-blur-md z-40 flex flex-col select-none transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="truncate">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {project.title}
          </h2>
          <p className="text-[11px] text-neutral-500 truncate">Workspace Details & Logs</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Tab Bar */}
      <div className="flex items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'notes'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Brief</span>
        </button>

        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'tags'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Tags</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'activity'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Log</span>
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-medium">Project Scope & Guidelines</span>
              <span className="text-[11px] font-mono">Autosaved</span>
            </div>
            <textarea
              value={project.notes || ''}
              onChange={handleNotesChange}
              rows={16}
              placeholder="Record overarching project brief, team constraints, meeting action items, links, or architectural invariants..."
              className="w-full text-xs text-neutral-800 dark:text-neutral-200 bg-neutral-50/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 leading-relaxed resize-none"
            />
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500">
              Categorize and filter this workspace across your team.
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                }}
                placeholder="New tag name..."
                className="flex-1 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Active Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {project.tags.length === 0 && (
                  <p className="text-xs text-neutral-400 italic">No tags assigned yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-500">Total Canvas Nodes</span>
                <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
                  {totalNodes}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-500">Active Connections</span>
                <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
                  {project.connections.length}
                </p>
              </div>
            </div>

            {/* Task Breakdown */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Task Completion</span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
                  {completedTasks}/{taskNodes.length} ({taskNodes.length > 0 ? Math.round((completedTasks / taskNodes.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${taskNodes.length > 0 ? (completedTasks / taskNodes.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Milestone Progress */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                  <Flag className="w-4 h-4 text-amber-600" />
                  <span>Milestones Achieved</span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
                  {achievedMilestones}/{milestoneNodes.length}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${milestoneNodes.length > 0 ? (achievedMilestones / milestoneNodes.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Node Breakdown List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                Node Type Distribution
              </span>
              <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/80">
                  <span>Note Cards</span>
                  <span className="font-mono tabular-nums">{project.nodes.filter((n) => n.type === 'note').length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/80">
                  <span>Task Cards</span>
                  <span className="font-mono tabular-nums">{taskNodes.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/80">
                  <span>Milestones</span>
                  <span className="font-mono tabular-nums">{milestoneNodes.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/80">
                  <span>Links & Attachments</span>
                  <span className="font-mono tabular-nums">{project.nodes.filter((n) => n.type === 'link').length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/80">
                  <span>Images</span>
                  <span className="font-mono tabular-nums">{project.nodes.filter((n) => n.type === 'image').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div className="text-xs text-neutral-500">
              Audit trail of canvas actions and project updates.
            </div>

            <div className="space-y-2.5">
              {(project.activity || []).map((log) => {
                const date = new Date(log.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800"
                  >
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-800 dark:text-neutral-200 leading-snug">
                        {log.text}
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {timeStr}
                      </span>
                    </div>
                  </div>
                );
              })}

              {(!project.activity || project.activity.length === 0) && (
                <p className="text-xs text-neutral-400 italic">No activity recorded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
