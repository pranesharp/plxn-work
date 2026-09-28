import React from 'react';
import { NodeType } from '../../types';
import { 
  FileText, 
  CheckSquare, 
  Flag, 
  Link2, 
  Image as ImageIcon, 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  Sparkles 
} from 'lucide-react';

interface CanvasToolbarProps {
  onAddNode: (type: NodeType) => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onZoomToFit: () => void;
  onTidyLayout: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddNode,
  snapEnabled,
  onToggleSnap,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onZoomToFit,
  onTidyLayout,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('text/plxn-node-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="flex items-center gap-1 p-1 bg-white/95 dark:bg-[#1A1A1E]/95 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-lg backdrop-blur-md">
        {/* Node Creation Palette */}
        <div className="flex items-center gap-0.5 px-1 border-r border-neutral-200 dark:border-neutral-800">
          <button
            draggable
            onDragStart={(e) => handleDragStart(e, 'note')}
            onClick={() => onAddNode('note')}
            title="Note Node (shortcut: N) - Click or Drag onto canvas"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors text-xs font-medium cursor-grab active:cursor-grabbing"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Note</span>
          </button>

          <button
            draggable
            onDragStart={(e) => handleDragStart(e, 'task')}
            onClick={() => onAddNode('task')}
            title="Task Node (shortcut: T) - Click or Drag onto canvas"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors text-xs font-medium cursor-grab active:cursor-grabbing"
          >
            <CheckSquare className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Task</span>
          </button>

          <button
            draggable
            onDragStart={(e) => handleDragStart(e, 'milestone')}
            onClick={() => onAddNode('milestone')}
            title="Milestone Node (shortcut: M) - Click or Drag onto canvas"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors text-xs font-medium cursor-grab active:cursor-grabbing"
          >
            <Flag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Milestone</span>
          </button>

          <button
            draggable
            onDragStart={(e) => handleDragStart(e, 'link')}
            onClick={() => onAddNode('link')}
            title="Link Node (shortcut: L) - Click or Drag onto canvas"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors text-xs font-medium cursor-grab active:cursor-grabbing"
          >
            <Link2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Link</span>
          </button>

          <button
            draggable
            onDragStart={(e) => handleDragStart(e, 'image')}
            onClick={() => onAddNode('image')}
            title="Image Node - Click or Drag onto canvas"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors text-xs font-medium cursor-grab active:cursor-grabbing"
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="hidden sm:inline">Image</span>
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 px-1 border-r border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Canvas Tools: Snap, Tidy, Zoom */}
        <div className="flex items-center gap-0.5 px-1">
          <button
            onClick={onToggleSnap}
            title={snapEnabled ? 'Snap to grid: Enabled' : 'Snap to grid: Disabled'}
            className={`p-1.5 rounded-lg transition-colors ${
              snapEnabled
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTidyLayout}
            title="Tidy & Align Nodes Workflow"
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:border-neutral-800 mx-0.5" />

          <button
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetZoom}
            title="Reset Zoom (100%)"
            className="px-1.5 py-0.5 text-[11px] font-mono tabular-nums text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onZoomToFit}
            title="Zoom to Fit All (shortcut: 0)"
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
