import React, { useState, useRef, useCallback } from 'react';
import { Project, DrawingElement, DrawingPoint, CanvasViewport } from '../../types';
import { useProjectContext } from '../../context/ProjectContext';
import { screenToCanvas } from '../../utils/canvasMath';
import { pointsToSvgPath, getArrowheadPoints, isPointNearDrawing } from '../../utils/drawingMath';

interface DrawingLayerProps {
  project: Project;
  viewport: CanvasViewport;
  containerRef: React.RefObject<HTMLDivElement | null>;
  spacePressed: boolean;
}

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  project,
  viewport,
  containerRef,
  spacePressed,
}) => {
  const {
    isDrawMode,
    drawingTool,
    drawingColor,
    drawingStrokeWidth,
    drawingFill,
    addDrawingElement,
    deleteDrawingElements,
  } = useProjectContext();

  const [activeElement, setActiveElement] = useState<DrawingElement | null>(null);
  const isPointerDownRef = useRef(false);
  const erasedInCurrentDragRef = useRef<Set<string>>(new Set());

  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number): DrawingPoint => {
      if (!containerRef.current) return { x: clientX, y: clientY };
      const rect = containerRef.current.getBoundingClientRect();
      const coords = screenToCanvas(clientX, clientY, rect, viewport);
      return coords;
    },
    [containerRef, viewport]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    // If Space is pressed, user wants to pan the canvas instead of drawing
    if (spacePressed || !isDrawMode || drawingTool === 'select') {
      return;
    }

    // Support primary button (0 - left click / pen tip) and secondary button (2 - right click / tablet stylus button)
    if (e.button !== 0 && e.button !== 2) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }

    isPointerDownRef.current = true;
    erasedInCurrentDragRef.current.clear();

    const canvasCoords = getCanvasCoords(e.clientX, e.clientY);
    const pressure = e.pressure > 0 ? e.pressure : 1;
    const initialPoint: DrawingPoint = { ...canvasCoords, pressure };

    if (drawingTool === 'eraser') {
      // Check if clicked directly on any drawing element
      const drawings = project.drawings || [];
      const hitIds: string[] = [];
      drawings.forEach((el) => {
        if (isPointNearDrawing(canvasCoords.x, canvasCoords.y, el, 16)) {
          hitIds.push(el.id);
          erasedInCurrentDragRef.current.add(el.id);
        }
      });
      if (hitIds.length > 0) {
        deleteDrawingElements(hitIds);
      }
      return;
    }

    if (drawingTool === 'pen') {
      const newStroke: DrawingElement = {
        id: 'draw-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: 'stroke',
        points: [initialPoint],
        color: drawingColor,
        strokeWidth: drawingStrokeWidth,
      };
      setActiveElement(newStroke);
      return;
    }

    if (['line', 'arrow', 'rect', 'circle'].includes(drawingTool)) {
      const newShape: DrawingElement = {
        id: 'draw-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: drawingTool as DrawingElement['type'],
        points: [initialPoint, initialPoint],
        color: drawingColor,
        strokeWidth: drawingStrokeWidth,
        fill: drawingFill,
      };
      setActiveElement(newShape);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isPointerDownRef.current || !isDrawMode || spacePressed) {
      return;
    }

    e.preventDefault();
    const canvasCoords = getCanvasCoords(e.clientX, e.clientY);
    const pressure = e.pressure > 0 ? e.pressure : 1;
    const currentPoint: DrawingPoint = { ...canvasCoords, pressure };

    if (drawingTool === 'eraser') {
      // Erase any element the pointer brushes over
      const drawings = project.drawings || [];
      const newHits: string[] = [];
      drawings.forEach((el) => {
        if (
          !erasedInCurrentDragRef.current.has(el.id) &&
          isPointNearDrawing(canvasCoords.x, canvasCoords.y, el, 16)
        ) {
          newHits.push(el.id);
          erasedInCurrentDragRef.current.add(el.id);
        }
      });
      if (newHits.length > 0) {
        deleteDrawingElements(newHits);
      }
      return;
    }

    if (!activeElement) return;

    if (activeElement.type === 'stroke') {
      const prevPoints = activeElement.points;
      const lastPoint = prevPoints[prevPoints.length - 1];

      // Minimum distance filter to smooth out performance
      const dist = Math.hypot(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y);
      if (dist >= 1.5) {
        setActiveElement({
          ...activeElement,
          points: [...prevPoints, currentPoint],
        });
      }
      return;
    }

    if (['line', 'arrow', 'rect', 'circle'].includes(activeElement.type)) {
      setActiveElement({
        ...activeElement,
        points: [activeElement.points[0], currentPoint],
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore if pointer capture already lost
    }

    if (activeElement) {
      // Commit drawing element to project if it has valid geometry
      if (activeElement.type === 'stroke' && activeElement.points.length > 0) {
        addDrawingElement(activeElement);
      } else if (activeElement.points.length >= 2) {
        const p1 = activeElement.points[0];
        const p2 = activeElement.points[1];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        // Only add if user actually dragged more than 3px (not an accidental zero-click)
        if (dist >= 3) {
          addDrawingElement(activeElement);
        }
      }
      setActiveElement(null);
    }
  };

  const renderElement = (el: DrawingElement, isGhost = false) => {
    const { id, type, points, color, strokeWidth, fill } = el;
    if (!points || points.length === 0) return null;

    const opacity = isGhost ? 0.8 : el.opacity || 1;

    switch (type) {
      case 'stroke': {
        const pathD = pointsToSvgPath(points);
        return (
          <path
            key={id}
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={opacity}
          />
        );
      }

      case 'line': {
        if (points.length < 2) return null;
        return (
          <line
            key={id}
            x1={points[0].x}
            y1={points[0].y}
            x2={points[1].x}
            y2={points[1].y}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={opacity}
          />
        );
      }

      case 'arrow': {
        if (points.length < 2) return null;
        const arrow = getArrowheadPoints(points[0], points[1], strokeWidth);
        return (
          <g key={id} opacity={opacity}>
            <line
              x1={points[0].x}
              y1={points[0].y}
              x2={arrow.lineEnd.x}
              y2={arrow.lineEnd.y}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path d={arrow.arrowPath} fill={color} />
          </g>
        );
      }

      case 'rect': {
        if (points.length < 2) return null;
        const x = Math.min(points[0].x, points[1].x);
        const y = Math.min(points[0].y, points[1].y);
        const width = Math.abs(points[1].x - points[0].x);
        const height = Math.abs(points[1].y - points[0].y);
        return (
          <rect
            key={id}
            x={x}
            y={y}
            width={width}
            height={height}
            rx={4}
            stroke={color}
            strokeWidth={strokeWidth}
            fill={fill && fill !== 'none' ? fill : 'none'}
            opacity={opacity}
          />
        );
      }

      case 'circle': {
        if (points.length < 2) return null;
        const cx = (points[0].x + points[1].x) / 2;
        const cy = (points[0].y + points[1].y) / 2;
        const rx = Math.abs(points[1].x - points[0].x) / 2;
        const ry = Math.abs(points[1].y - points[0].y) / 2;
        return (
          <ellipse
            key={id}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            stroke={color}
            strokeWidth={strokeWidth}
            fill={fill && fill !== 'none' ? fill : 'none'}
            opacity={opacity}
          />
        );
      }

      default:
        return null;
    }
  };

  const drawings = project.drawings || [];
  const canDraw = isDrawMode && drawingTool !== 'select' && !spacePressed;

  return (
    <svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: '1px',
        height: '1px',
        overflow: 'visible',
        touchAction: 'none',
        pointerEvents: canDraw ? 'auto' : 'none',
        cursor:
          isDrawMode && !spacePressed
            ? drawingTool === 'eraser'
              ? 'cell'
              : 'crosshair'
            : 'default',
      }}
      className="absolute top-0 left-0 z-20 select-none"
    >
      {/* Invisible backdrop plane to intercept all drawing pointer events across the infinite canvas */}
      {canDraw && (
        <rect
          x="-500000"
          y="-500000"
          width="1000000"
          height="1000000"
          fill="transparent"
          pointerEvents="all"
        />
      )}

      {/* Existing Committed Drawings */}
      {drawings.map((el) => renderElement(el))}

      {/* Active in-progress drawing preview */}
      {activeElement && renderElement(activeElement, true)}
    </svg>
  );
};
