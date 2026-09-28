import React, { useState } from 'react';
import { NodeItem, ChecklistItem } from '../../../types';
import { useProjectContext } from '../../../context/ProjectContext';
import { Plus, Check, X, FileText } from 'lucide-react';

interface NoteNodeProps {
  node: NodeItem;
}

export const NoteNode: React.FC<NoteNodeProps> = ({ node }) => {
  const { updateNode } = useProjectContext();
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { content: e.target.value });
  };

  const toggleChecklistItem = (itemId: string) => {
    const list = node.checklist || [];
    const updated = list.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    updateNode(node.id, { checklist: updated }, true);
  };

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: 'c-' + Date.now(),
      text: newChecklistText.trim(),
      done: false,
    };
    const list = node.checklist || [];
    updateNode(node.id, { checklist: [...list, newItem] }, true);
    setNewChecklistText('');
    setIsAddingItem(false);
  };

  const removeChecklistItem = (itemId: string) => {
    const list = node.checklist || [];
    updateNode(node.id, { checklist: list.filter((i) => i.id !== itemId) }, true);
  };

  const checklist = node.checklist || [];
  const completedCount = checklist.filter((i) => i.done).length;

  return (
    <div className="space-y-3">
      {/* Title */}
      <input
        type="text"
        value={node.title}
        onChange={handleTitleChange}
        placeholder="Note title..."
        className="w-full bg-transparent font-medium text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded px-1 -mx-1"
      />

      {/* Content / Body */}
      <textarea
        value={node.content || ''}
        onChange={handleContentChange}
        rows={3}
        placeholder="Write note or brief description..."
        className="w-full resize-none bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-xs text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 rounded p-2 transition-colors border border-black/5 dark:border-white/5 leading-relaxed"
      />

      {/* Interactive Checklist */}
      <div className="space-y-1.5 pt-1">
        {checklist.length > 0 && (
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium px-0.5">
            <span>Checklist</span>
            <span className="font-mono tabular-nums">{completedCount}/{checklist.length}</span>
          </div>
        )}

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="group/item flex items-center justify-between gap-2 p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-xs text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="rounded border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span
                  className={`truncate text-xs ${
                    item.done
                      ? 'line-through text-neutral-400 dark:text-neutral-500'
                      : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {item.text}
                </span>
              </label>
              <button
                onClick={() => removeChecklistItem(item.id)}
                className="opacity-0 group-hover/item:opacity-100 p-0.5 text-neutral-400 hover:text-red-500 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add item control */}
        {isAddingItem ? (
          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              autoFocus
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addChecklistItem();
                if (e.key === 'Escape') setIsAddingItem(false);
              }}
              placeholder="New checklist item..."
              className="flex-1 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
            <button
              onClick={addChecklistItem}
              className="p-1 rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsAddingItem(false)}
              className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors py-1 px-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Plus className="w-3 h-3" />
            <span>Add item</span>
          </button>
        )}
      </div>
    </div>
  );
};
