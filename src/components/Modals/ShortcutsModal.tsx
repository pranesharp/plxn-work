import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'N', desc: 'Create new Note card at center of canvas' },
    { key: 'T', desc: 'Create new Task card at center of canvas' },
    { key: 'M', desc: 'Create new Milestone / Phase card' },
    { key: 'L', desc: 'Create new Link / Resource card' },
    { key: 'Space + Drag', desc: 'Pan infinite canvas smoothly' },
    { key: 'Ctrl + Wheel', desc: 'Zoom in / out centered on cursor' },
    { key: '0', desc: 'Zoom to fit all nodes on screen' },
    { key: 'Ctrl + D', desc: 'Duplicate selected node' },
    { key: 'Del / Backspace', desc: 'Delete selected node or connection' },
    { key: 'Ctrl + Z', desc: 'Undo canvas move or edit' },
    { key: 'Ctrl + Y / ⇧⌘Z', desc: 'Redo previously undone action' },
    { key: 'Double Click Canvas', desc: 'Quick-create a Note card at cursor' },
    { key: 'Drag from side dot', desc: 'Draw a bezier connection line to another node' },
    { key: 'Esc', desc: 'Deselect all cards and dismiss popups' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-neutral-500" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 space-y-2.5 max-h-[75vh] overflow-y-auto">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/80"
            >
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                {s.desc}
              </span>
              <kbd className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono text-[11px] border border-neutral-200 dark:border-neutral-700 shadow-2xs shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
