import React, { useState, useRef, useEffect } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { DrawingTool } from '../../types';
import {
  MousePointer,
  Pencil,
  Eraser,
  Minus,
  MoveUpRight,
  Square,
  Circle,
  Trash2,
  X,
  Palette,
  Check,
  AlertCircle
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Charcoal', value: '#18181B' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Graphite', value: '#64748B' },
  { name: 'Crimson', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Highlighter', value: '#EAB308' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Sky', value: '#0EA5E9' },
  { name: 'Purple', value: '#8B5CF6' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Bold', value: 8 },
  { label: 'Marker', value: 14 },
];

export const DrawingToolbar: React.FC = () => {
  const {
    isDrawMode,
    setIsDrawMode,
    drawingTool,
    setDrawingTool,
    drawingColor,
    setDrawingColor,
    drawingStrokeWidth,
    setDrawingStrokeWidth,
    drawingFill,
    setDrawingFill,
    clearDrawings,
    activeProject,
  } = useProjectContext();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showFillDropdown, setShowFillDropdown] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const drawingsCount = activeProject?.drawings?.length || 0;

  // Close confirmation on click outside
  useEffect(() => {
    if (!showClearConfirm) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#clear-drawings-popover')) {
        setShowClearConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showClearConfirm]);

  if (!isDrawMode) return null;

  const handleToolSelect = (tool: DrawingTool) => {
    setDrawingTool(tool);
    setShowClearConfirm(false);
  };

  const handleConfirmClear = () => {
    clearDrawings();
    setShowClearConfirm(false);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex flex-col items-center gap-1.5">
        {/* Main Floating Tool Container */}
        <div className="flex items-center gap-1 p-1.5 bg-white/95 dark:bg-[#1A1A1E]/95 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md">
          {/* Tool Modes */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => handleToolSelect('select')}
              title="Select (V)"
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                drawingTool === 'select'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <MousePointer className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('pen')}
              title="Pen (P)"
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                drawingTool === 'pen'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('eraser')}
              title="Eraser (E)"
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                drawingTool === 'eraser'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Eraser className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-0.5" />

            {/* Basic Shapes */}
            <button
              onClick={() => handleToolSelect('line')}
              title="Line (L)"
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                drawingTool === 'line'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Minus className="w-4 h-4 transform -rotate-45" />
            </button>

            <button
              onClick={() => handleToolSelect('arrow')}
              title="Arrow (A)"
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                drawingTool === 'arrow'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <MoveUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('rect')}
              title="Rectangle (R)"
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                drawingTool === 'rect'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Square className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleToolSelect('circle')}
              title="Circle (C)"
              className={`p-2 rounded-xl text-xs font-medium transition-colors ${
                drawingTool === 'circle'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Circle className="w-4 h-4" />
            </button>
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1 px-1.5 border-r border-neutral-200 dark:border-neutral-800">
            {STROKE_WIDTHS.map((sw) => (
              <button
                key={sw.value}
                onClick={() => setDrawingStrokeWidth(sw.value)}
                title={`${sw.label} stroke (${sw.value}px)`}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  drawingStrokeWidth === sw.value
                    ? 'bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-400 dark:ring-neutral-500'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div
                  className="rounded-full bg-neutral-800 dark:bg-neutral-200"
                  style={{
                    width: `${Math.min(sw.value, 10)}px`,
                    height: `${Math.min(sw.value, 10)}px`,
                  }}
                />
              </button>
            ))}
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1 px-1.5 border-r border-neutral-200 dark:border-neutral-800">
            {PRESET_COLORS.map((col) => (
              <button
                key={col.value}
                onClick={() => setDrawingColor(col.value)}
                title={col.name}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                  drawingColor === col.value
                    ? 'scale-125 ring-2 ring-offset-1 ring-neutral-900 dark:ring-white dark:ring-offset-[#1A1A1E]'
                    : 'hover:scale-110'
                } ${col.value === '#FFFFFF' ? 'border border-neutral-300 dark:border-neutral-600' : ''}`}
                style={{ backgroundColor: col.value }}
              >
                {drawingColor === col.value && (
                  <Check
                    className={`w-2.5 h-2.5 ${
                      col.value === '#FFFFFF' || col.value === '#EAB308'
                        ? 'text-neutral-900'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            ))}

            {/* Custom Color Native Picker */}
            <div className="relative">
              <button
                onClick={() => colorInputRef.current?.click()}
                title="Custom Color"
                className="w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-tr from-pink-500 via-sky-500 to-amber-500 hover:scale-110 transition-transform"
              >
                <Palette className="w-2.5 h-2.5 text-white" />
              </button>
              <input
                ref={colorInputRef}
                type="color"
                value={drawingColor}
                onChange={(e) => setDrawingColor(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {/* Shape Fill Mode */}
          {['rect', 'circle'].includes(drawingTool) && (
            <div className="flex items-center gap-1 px-1.5 border-r border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setDrawingFill('none')}
                className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                  drawingFill === 'none'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Outline
              </button>
              <button
                onClick={() => setDrawingFill(`${drawingColor}26`)} // 15% opacity hex
                className={`px-2 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                  drawingFill !== 'none'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Tint Fill
              </button>
            </div>
          )}

          {/* Clear Drawings Button with Confirmation */}
          <div className="relative pl-1">
            <button
              onClick={() => setShowClearConfirm(!showClearConfirm)}
              disabled={drawingsCount === 0}
              title="Clear all drawn strokes and shapes (keeps nodes and cards)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Drawings</span>
            </button>

            {/* Confirmation Popover */}
            {showClearConfirm && (
              <div
                id="clear-drawings-popover"
                className="absolute bottom-full mb-2 right-0 w-64 p-3 bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 text-left"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      Clear Drawings Only?
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                      This deletes all {drawingsCount} hand-drawn lines & shapes. Your cards, tasks,
                      and notes stay 100% intact.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2.5 py-1 text-xs rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmClear}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                  >
                    Clear Drawings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close / Exit Draw Mode */}
          <button
            onClick={() => setIsDrawMode(false)}
            title="Exit Draw Mode (Esc)"
            className="p-1.5 ml-1 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quiet Tablet Stylus / Keyboard Helper Banner */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 px-3 py-1 bg-white/80 dark:bg-[#1A1A1E]/80 border border-neutral-200/60 dark:border-neutral-800/60 rounded-full shadow-xs backdrop-blur-xs">
          <span>Stylus Tablet Ready</span>
          <span aria-hidden="true">·</span>
          <span>Hold Space to pan canvas</span>
          <span aria-hidden="true">·</span>
          <span>Ctrl+Z to undo strokes</span>
        </div>
      </div>
    </div>
  );
};
