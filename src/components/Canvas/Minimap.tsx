import React, { useRef, useState } from 'react';
import { NodeItem, CanvasViewport } from '../../types';
import { getCanvasBounds } from '../../utils/canvasMath';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { COLOR_MAP } from './Nodes/NodeWrapper';

interface MinimapProps {
  nodes: NodeItem[];
  viewport: CanvasViewport;
  containerWidth: number;
  containerHeight: number;
  onNavigate: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  nodes,
  viewport,
  containerWidth,
  containerHeight,
  onNavigate,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Map geometry
  const MAP_WIDTH = 180;
  const MAP_HEIGHT = 120;

  const bounds = getCanvasBounds(nodes, 200);
  const scaleX = MAP_WIDTH / bounds.width;
  const scaleY = MAP_HEIGHT / bounds.height;
  const mapScale = Math.min(scaleX, scaleY, 0.15);

  const offsetX = (MAP_WIDTH - bounds.width * mapScale) / 2;
  const offsetY = (MAP_HEIGHT - bounds.height * mapScale) / 2;

  // Viewport rect calculation in canvas coordinates
  const viewCanvasX = -viewport.x / viewport.zoom;
  const viewCanvasY = -viewport.y / viewport.zoom;
  const viewCanvasW = containerWidth / viewport.zoom;
  const viewCanvasH = containerHeight / viewport.zoom;

  // Map rect in minimap pixel coordinates
  const vpMapX = (viewCanvasX - bounds.minX) * mapScale + offsetX;
  const vpMapY = (viewCanvasY - bounds.minY) * mapScale + offsetY;
  const vpMapW = viewCanvasW * mapScale;
  const vpMapH = viewCanvasH * mapScale;

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;

    const targetCanvasX = bounds.minX + clickX / mapScale;
    const targetCanvasY = bounds.minY + clickY / mapScale;

    // Center camera at target
    const newViewportX = containerWidth / 2 - targetCanvasX * viewport.zoom;
    const newViewportY = containerHeight / 2 - targetCanvasY * viewport.zoom;
    onNavigate(newViewportX, newViewportY);
  };

  return (
    <div className="absolute bottom-4 right-4 z-30 select-none">
      <div className="bg-white/95 dark:bg-[#1A1A1E]/95 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg backdrop-blur-md overflow-hidden transition-all">
        {/* Header bar */}
        <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-neutral-400" />
            <span>Navigator</span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            {collapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Minimap Body */}
        {!collapsed && (
          <div
            ref={mapRef}
            onClick={handleMinimapClick}
            style={{ width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px` }}
            className="relative bg-neutral-50/80 dark:bg-[#121214]/80 cursor-crosshair overflow-hidden"
          >
            {/* Render Node Dots/Boxes */}
            {nodes.map((node) => {
              const nx = (node.x - bounds.minX) * mapScale + offsetX;
              const ny = (node.y - bounds.minY) * mapScale + offsetY;
              const nw = Math.max((node.width || 280) * mapScale, 4);
              const nh = Math.max((node.height || 140) * mapScale, 4);
              const colorConfig = COLOR_MAP[node.color] || COLOR_MAP.neutral;

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${nx}px`,
                    top: `${ny}px`,
                    width: `${nw}px`,
                    height: `${nh}px`,
                  }}
                  className={`absolute rounded-xs ${colorConfig.accent} opacity-70`}
                />
              );
            })}

            {/* Viewport Box */}
            <div
              style={{
                left: `${Math.max(0, vpMapX)}px`,
                top: `${Math.max(0, vpMapY)}px`,
                width: `${Math.max(8, vpMapW)}px`,
                height: `${Math.max(8, vpMapH)}px`,
              }}
              className="absolute border border-neutral-900 dark:border-neutral-100 bg-neutral-500/15 pointer-events-none rounded-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};
