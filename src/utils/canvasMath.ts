import { NodeItem, ConnectionHandle, CanvasViewport } from '../types';

export const GRID_SIZE = 20;

export function snapToGrid(value: number, enabled: boolean = true): number {
  if (!enabled) return value;
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function screenToCanvas(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  viewport: CanvasViewport
): { x: number; y: number } {
  const relX = clientX - containerRect.left;
  const relY = clientY - containerRect.top;
  return {
    x: (relX - viewport.x) / viewport.zoom,
    y: (relY - viewport.y) / viewport.zoom,
  };
}

export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  containerRect: DOMRect,
  viewport: CanvasViewport
): { x: number; y: number } {
  return {
    x: containerRect.left + viewport.x + canvasX * viewport.zoom,
    y: containerRect.top + viewport.y + canvasY * viewport.zoom,
  };
}

export function getNodeHandlePosition(
  node: NodeItem,
  handle: ConnectionHandle = 'right',
  nodeElementHeight: number = 160
): { x: number; y: number } {
  const width = node.width || 280;
  const height = node.height || nodeElementHeight;

  switch (handle) {
    case 'top':
      return { x: node.x + width / 2, y: node.y };
    case 'right':
      return { x: node.x + width, y: node.y + height / 2 };
    case 'bottom':
      return { x: node.x + width / 2, y: node.y + height };
    case 'left':
      return { x: node.x, y: node.y + height / 2 };
  }
}

export function calculateBezierCurve(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  startHandle: ConnectionHandle = 'right',
  endHandle: ConnectionHandle = 'left'
): string {
  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.max(40, Math.min(distance * 0.45, 180));

  let cp1X = startX;
  let cp1Y = startY;
  let cp2X = endX;
  let cp2Y = endY;

  switch (startHandle) {
    case 'right':
      cp1X += curvature;
      break;
    case 'left':
      cp1X -= curvature;
      break;
    case 'top':
      cp1Y -= curvature;
      break;
    case 'bottom':
      cp1Y += curvature;
      break;
  }

  switch (endHandle) {
    case 'right':
      cp2X += curvature;
      break;
    case 'left':
      cp2X -= curvature;
      break;
    case 'top':
      cp2Y -= curvature;
      break;
    case 'bottom':
      cp2Y += curvature;
      break;
  }

  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
}

export function getCanvasBounds(nodes: NodeItem[], padding = 120): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 1000, maxY: 800, width: 1000, height: 800 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const w = n.width || 280;
    const h = n.height || 180;
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + w);
    maxY = Math.max(maxY, n.y + h);
  });

  return {
    minX: minX - padding,
    minY: minY - padding,
    maxX: maxX + padding,
    maxY: maxY + padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}
