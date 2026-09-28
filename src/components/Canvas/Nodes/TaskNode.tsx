import React from 'react';
import { NodeItem, TaskStatus, Priority } from '../../../types';
import { useProjectContext } from '../../../context/ProjectContext';
import { CheckCircle2, Circle, Clock, Calendar, User, AlertCircle } from 'lucide-react';

interface TaskNodeProps {
  node: NodeItem;
}

export const TaskNode: React.FC<TaskNodeProps> = ({ node }) => {
  const { updateNode, addActivityLog } = useProjectContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const setStatus = (status: TaskStatus) => {
    updateNode(node.id, { status }, true);
    addActivityLog(`Marked task "${node.title}" as ${status}`, 'update');
  };

  const toggleComplete = () => {
    const nextStatus = node.status === 'done' ? 'todo' : 'done';
    setStatus(nextStatus);
  };

  const setPriority = (priority: Priority) => {
    updateNode(node.id, { priority }, true);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { dueDate: e.target.value });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { assignee: e.target.value });
  };

  const isDone = node.status === 'done';

  return (
    <div className="space-y-3">
      {/* Task Header with Quick Checkbox */}
      <div className="flex items-start gap-2">
        <button
          onClick={toggleComplete}
          className="mt-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shrink-0"
          title={isDone ? 'Mark as incomplete' : 'Mark as done'}
        >
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500 fill-emerald-100 dark:fill-emerald-950/40" />
          ) : node.status === 'in-progress' ? (
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          ) : (
            <Circle className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        <input
          type="text"
          value={node.title}
          onChange={handleTitleChange}
          placeholder="Task title..."
          className={`w-full bg-transparent font-medium text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 -mx-1 transition-all ${
            isDone
              ? 'line-through text-neutral-400 dark:text-neutral-500'
              : 'text-neutral-900 dark:text-neutral-100'
          }`}
        />
      </div>

      {/* Status Segmented Control (Interactive Button Control, clean NotebookLM style) */}
      <div className="flex items-center gap-1 p-0.5 bg-black/5 dark:bg-white/5 rounded-lg text-xs">
        <button
          onClick={() => setStatus('todo')}
          className={`flex-1 py-1 px-2 text-center rounded-md font-medium transition-colors ${
            node.status === 'todo' || !node.status
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          To Do
        </button>
        <button
          onClick={() => setStatus('in-progress')}
          className={`flex-1 py-1 px-2 text-center rounded-md font-medium transition-colors ${
            node.status === 'in-progress'
              ? 'bg-white dark:bg-neutral-800 text-sky-700 dark:text-sky-300 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatus('done')}
          className={`flex-1 py-1 px-2 text-center rounded-md font-medium transition-colors ${
            node.status === 'done'
              ? 'bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
          }`}
        >
          Done
        </button>
      </div>

      {/* Metadata Fields: Due Date, Priority, Assignee */}
      <div className="pt-1 border-t border-black/5 dark:border-white/5 space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px]">Due</span>
          </div>
          <input
            type="text"
            value={node.dueDate || ''}
            onChange={handleDueDateChange}
            placeholder="e.g. Oct 24"
            className="w-28 text-right bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 shrink-0">
            <User className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px]">Owner</span>
          </div>
          <input
            type="text"
            value={node.assignee || ''}
            onChange={handleAssigneeChange}
            placeholder="Assign name..."
            className="w-32 text-right bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 text-xs text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center justify-between gap-2 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px]">Priority</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`capitalize px-1.5 py-0.5 rounded transition-colors ${
                  node.priority === p
                    ? p === 'high'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-semibold'
                      : p === 'medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold'
                      : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
