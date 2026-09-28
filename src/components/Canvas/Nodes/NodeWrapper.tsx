import React, { useState, useRef, useEffect } from 'react';
import { NodeItem, NodeColor, ConnectionHandle } from '../../../types';
import { useProjectContext } from '../../../context/ProjectContext';
import { 
  MoreHorizontal, 
  Trash2, 
  Copy, 
  Lock, 
  Unlock, 
  Palette, 
  Layers, 
  GripHorizontal 
} from 'lucide-react';

interface NodeWrapperProps {
  node: NodeItem;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onStartDrag: (e: React.MouseEvent, node: NodeItem) => void;
  onStartConnection: (nodeId: string, handle: ConnectionHandle, e: React.MouseEvent) => void;
  onEndConnection: (nodeId: string, handle: ConnectionHandle, e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export const COLOR_MAP: Record<NodeColor, { bg: string; border: string; accent: string; label: string }> = {
  neutral: { 
    bg: 'bg-white dark:bg-[#1A1A1E]', 
    border: 'border-neutral-200 dark:border-neutral-800', 
    accent: 'bg-neutral-500', 
    label: 'Neutral' 
  },
  sage: { 
    bg: 'bg-[#F4F7F4] dark:bg-[#17221A]', 
    border: 'border-[#CCE0CE] dark:border-[#263D2B]', 
    accent: 'bg-emerald-600', 
    label: 'Sage' 
  },
  sky: { 
    bg: 'bg-[#F0F6FA] dark:bg-[#14202B]', 
    border: 'border-[#C8DFEE] dark:border-[#20374D]', 
    accent: 'bg-sky-600', 
    label: 'Sky' 
  },
  amber: { 
    bg: 'bg-[#FAF6ED] dark:bg-[#252016]', 
    border: 'border-[#F0E2C5] dark:border-[#443822]', 
    accent: 'bg-amber-600', 
    label: 'Amber' 
  },
  lavender: { 
    bg: 'bg-[#F6F3FA] dark:bg-[#201A29]', 
    border: 'border-[#E2D8F2] dark:border-[#3A2C4C]', 
    accent: 'bg-indigo-600', 
    label: 'Lavender' 
  },
  rose: { 
    bg: 'bg-[#FAF1F3] dark:bg-[#26171B]', 
    border: 'border-[#F2D3DA] dark:border-[#46242D]', 
    accent: 'bg-rose-600', 
    label: 'Rose' 
  },
  slate: { 
    bg: 'bg-[#F2F4F7] dark:bg-[#181B20]', 
    border: 'border-[#D9DEE5] dark:border-[#2B313D]', 
    accent: 'bg-slate-600', 
    label: 'Slate' 
  },
};

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  node,
  isSelected,
  onSelect,
  onStartDrag,
  onStartConnection,
  onEndConnection,
  children,
}) => {
  const { updateNode, deleteNode, duplicateNode, bringToFront } = useProjectContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setShowMenu(false);
        setShowColorPicker(false);
      }
    };
    if (showMenu || showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, showColorPicker]);

  const styleConfig = COLOR_MAP[node.color] || COLOR_MAP.neutral;

  const handlePortMouseDown = (e: React.MouseEvent, handle: ConnectionHandle) => {
    e.stopPropagation();
    onStartConnection(node.id, handle, e);
  };

  const handlePortMouseUp = (e: React.MouseEvent, handle: ConnectionHandle) => {
    e.stopPropagation();
    onEndConnection(node.id, handle, e);
  };

  return (
    <div
      id={`node-${node.id}`}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        width: `${node.width || 300}px`,
        zIndex: node.zIndex || 10,
      }}
      onClick={onSelect}
      className={`group absolute select-none rounded-xl transition-shadow duration-150 border ${styleConfig.bg} ${styleConfig.border} ${
        isSelected
          ? 'ring-2 ring-neutral-900 dark:ring-neutral-200 shadow-lg'
          : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Header / Drag Bar */}
      <div
        onMouseDown={(e) => {
          if (!node.locked && e.button === 0) {
            onStartDrag(e, node);
          }
        }}
        className={`flex items-center justify-between px-3 py-2 border-b border-black/5 dark:border-white/5 cursor-grab active:cursor-grabbing text-xs text-neutral-600 dark:text-neutral-400`}
      >
        <div className="flex items-center gap-1.5 truncate pr-2">
          <GripHorizontal className="w-3.5 h-3.5 shrink-0 opacity-40 hover:opacity-100" />
          <span className="font-medium tracking-tight truncate capitalize">
            {node.type}
          </span>
          {node.locked && (
            <Lock className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0 ml-1" />
          )}
        </div>

        {/* Menu & quick actions */}
        <div className="flex items-center gap-0.5 relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            title="Node options"
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Context Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-7 w-44 bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-50 py-1 text-xs">
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Palette className="w-3.5 h-3.5 text-neutral-400" />
                <span>Color Accent</span>
              </button>

              {showColorPicker && (
                <div className="px-3 py-2 grid grid-cols-4 gap-1.5 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50">
                  {(Object.keys(COLOR_MAP) as NodeColor[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        updateNode(node.id, { color: c }, true);
                        setShowColorPicker(false);
                      }}
                      title={COLOR_MAP[c].label}
                      className={`w-5 h-5 rounded-full border border-black/10 dark:border-white/10 ${COLOR_MAP[c].bg} flex items-center justify-center hover:scale-110 transition-transform ${
                        node.color === c ? 'ring-2 ring-neutral-800 dark:ring-neutral-200' : ''
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${COLOR_MAP[c].accent}`} />
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  updateNode(node.id, { locked: !node.locked }, true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {node.locked ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Unlock Node</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Lock Position</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  duplicateNode(node.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => {
                  bringToFront(node.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Bring to Front</span>
              </button>

              <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />

              <button
                onClick={() => {
                  deleteNode(node.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Node Body */}
      <div className="p-3.5">{children}</div>

      {/* Connection Anchor Ports (Top, Right, Bottom, Left) */}
      <div
        title="Connect from Top"
        onMouseDown={(e) => handlePortMouseDown(e, 'top')}
        onMouseUp={(e) => handlePortMouseUp(e, 'top')}
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-500 hover:border-neutral-900 dark:hover:border-white hover:scale-125 cursor-crosshair transition-all opacity-0 group-hover:opacity-80 hover:opacity-100 z-30"
      />
      <div
        title="Connect Output (Right)"
        onMouseDown={(e) => handlePortMouseDown(e, 'right')}
        onMouseUp={(e) => handlePortMouseUp(e, 'right')}
        className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-500 hover:border-neutral-900 dark:hover:border-white hover:scale-125 cursor-crosshair transition-all opacity-40 group-hover:opacity-100 hover:opacity-100 z-30"
      />
      <div
        title="Connect from Bottom"
        onMouseDown={(e) => handlePortMouseDown(e, 'bottom')}
        onMouseUp={(e) => handlePortMouseUp(e, 'bottom')}
        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-500 hover:border-neutral-900 dark:hover:border-white hover:scale-125 cursor-crosshair transition-all opacity-0 group-hover:opacity-80 hover:opacity-100 z-30"
      />
      <div
        title="Connect Input (Left)"
        onMouseDown={(e) => handlePortMouseDown(e, 'left')}
        onMouseUp={(e) => handlePortMouseUp(e, 'left')}
        className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-500 hover:border-neutral-900 dark:hover:border-white hover:scale-125 cursor-crosshair transition-all opacity-40 group-hover:opacity-100 hover:opacity-100 z-30"
      />
    </div>
  );
};
