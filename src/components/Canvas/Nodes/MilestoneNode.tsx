import React from 'react';
import { NodeItem } from '../../../types';
import { useProjectContext } from '../../../context/ProjectContext';
import { Flag, Calendar, Sparkles } from 'lucide-react';

interface MilestoneNodeProps {
  node: NodeItem;
}

export const MilestoneNode: React.FC<MilestoneNodeProps> = ({ node }) => {
  const { updateNode, addActivityLog } = useProjectContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleTargetDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { targetDate: e.target.value });
  };

  const setMilestoneStatus = (status: 'planned' | 'in-progress' | 'achieved') => {
    const progress = status === 'achieved' ? 100 : status === 'in-progress' ? Math.max(node.progress || 50, 25) : 0;
    updateNode(node.id, { milestoneStatus: status, progress }, true);
    addActivityLog(`Milestone "${node.title}" updated to ${status}`, 'milestone');
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const status = val === 100 ? 'achieved' : val > 0 ? 'in-progress' : 'planned';
    updateNode(node.id, { progress: val, milestoneStatus: status });
  };

  const progress = node.progress ?? 0;
  const isAchieved = node.milestoneStatus === 'achieved' || progress === 100;

  return (
    <div className="space-y-3">
      {/* Milestone Header */}
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded-md shrink-0 ${
          isAchieved
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            : 'bg-neutral-200/70 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
        }`}>
          {isAchieved ? <Sparkles className="w-4 h-4" /> : <Flag className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={node.title}
            onChange={handleTitleChange}
            placeholder="Milestone / Phase title..."
            className="w-full bg-transparent font-semibold text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 -mx-1 truncate"
          />
        </div>
      </div>

      {/* Target Date */}
      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 px-0.5">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[11px]">Target Window</span>
        </div>
        <input
          type="text"
          value={node.targetDate || ''}
          onChange={handleTargetDateChange}
          placeholder="e.g. Q4 2026 / Oct 30"
          className="w-32 text-right bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
        />
      </div>

      {/* Progress Bar & Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
          <span>Stage Progress</span>
          <span className="font-mono tabular-nums font-semibold">{progress}%</span>
        </div>

        <div className="relative w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isAchieved
                ? 'bg-emerald-500'
                : progress > 50
                ? 'bg-sky-500'
                : 'bg-amber-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1 bg-transparent cursor-pointer accent-neutral-900 dark:accent-neutral-100"
        />
      </div>

      {/* Status Segmented Buttons */}
      <div className="flex items-center gap-1 p-0.5 bg-black/5 dark:bg-white/5 rounded-lg text-xs">
        <button
          onClick={() => setMilestoneStatus('planned')}
          className={`flex-1 py-1 px-1.5 text-center rounded-md font-medium text-[11px] transition-colors ${
            node.milestoneStatus === 'planned' || (!node.milestoneStatus && progress === 0)
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          Planned
        </button>
        <button
          onClick={() => setMilestoneStatus('in-progress')}
          className={`flex-1 py-1 px-1.5 text-center rounded-md font-medium text-[11px] transition-colors ${
            node.milestoneStatus === 'in-progress' || (progress > 0 && progress < 100)
              ? 'bg-white dark:bg-neutral-800 text-sky-700 dark:text-sky-300 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setMilestoneStatus('achieved')}
          className={`flex-1 py-1 px-1.5 text-center rounded-md font-medium text-[11px] transition-colors ${
            isAchieved
              ? 'bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          Achieved
        </button>
      </div>
    </div>
  );
};
