import { DrawingPoint, DrawingElement } from '../types';

/**
 * Converts a sequence of drawn points into a smooth SVG quadratic curve path
 * with midpoint interpolation for fluid pen/stylus handwriting.
 */
export function pointsToSvgPath(points: DrawingPoint[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
  }
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    d += ` Q ${p1.x} ${p1.y}, ${midX} ${midY}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

/**
 * Calculates arrowhead polygon points for a directional arrow line.
 */
export function getArrowheadPoints(
  start: DrawingPoint,
  end: DrawingPoint,
  strokeWidth: number
): { lineEnd: DrawingPoint; arrowPath: string } {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return { lineEnd: end, arrowPath: '' };
  }

  const angle = Math.atan2(dy, dx);
  const arrowSize = Math.max(12, strokeWidth * 3.5);
  const arrowAngle = Math.PI / 6; // 30 degrees

  // Coordinates of the two wings of the arrow
  const leftX = end.x - arrowSize * Math.cos(angle - arrowAngle);
  const leftY = end.y - arrowSize * Math.sin(angle - arrowAngle);
  const rightX = end.x - arrowSize * Math.cos(angle + arrowAngle);
  const rightY = end.y - arrowSize * Math.sin(angle + arrowAngle);

  // Shorten line slightly so it ends neatly inside the arrowhead
  const shortenBy = arrowSize * 0.7;
  const lineEndX = length > shortenBy ? end.x - shortenBy * Math.cos(angle) : start.x;
  const lineEndY = length > shortenBy ? end.y - shortenBy * Math.sin(angle) : start.y;

  const arrowPath = `M ${end.x} ${end.y} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`;

  return {
    lineEnd: { x: lineEndX, y: lineEndY },
    arrowPath,
  };
}

/**
 * Returns minimum distance from point (px, py) to line segment (x1, y1)-(x2, y2)
 */
export function distanceToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.hypot(px - x1, py - y1);
  }

  // Projection parameter t
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const projX = x1 + t * dx;
  const projY = y1 + t * dy;

  return Math.hypot(px - projX, py - projY);
}

/**
 * Determines whether a point (from eraser) intersects a drawing element.
 */
export function isPointNearDrawing(
  px: number,
  py: number,
  element: DrawingElement,
  hitThreshold: number = 14
): boolean {
  const threshold = Math.max(hitThreshold, element.strokeWidth / 2 + 8);
  const pts = element.points;
  if (!pts || pts.length === 0) return false;

  switch (element.type) {
    case 'stroke': {
      // Check distance to each segment along the stroke
      for (let i = 0; i < pts.length - 1; i++) {
        const dist = distanceToSegment(px, py, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
        if (dist <= threshold) return true;
      }
      if (pts.length === 1) {
        return Math.hypot(px - pts[0].x, py - pts[0].y) <= threshold;
      }
      return false;
    }

    case 'line':
    case 'arrow': {
      if (pts.length < 2) return false;
      return distanceToSegment(px, py, pts[0].x, pts[0].y, pts[1].x, pts[1].y) <= threshold;
    }

    case 'rect': {
      if (pts.length < 2) return false;
      const x1 = Math.min(pts[0].x, pts[1].x);
      const x2 = Math.max(pts[0].x, pts[1].x);
      const y1 = Math.min(pts[0].y, pts[1].y);
      const y2 = Math.max(pts[0].y, pts[1].y);

      // Check perimeter
      const nearPerimeter =
        distanceToSegment(px, py, x1, y1, x2, y1) <= threshold ||
        distanceToSegment(px, py, x2, y1, x2, y2) <= threshold ||
        distanceToSegment(px, py, x2, y2, x1, y2) <= threshold ||
        distanceToSegment(px, py, x1, y2, x1, y1) <= threshold;

      if (nearPerimeter) return true;

      // If shape has fill, also check interior
      if (element.fill && element.fill !== 'none') {
        if (px >= x1 && px <= x2 && py >= y1 && py <= y2) return true;
      }
      return false;
    }

    case 'circle': {
      if (pts.length < 2) return false;
      const x1 = pts[0].x;
      const y1 = pts[0].y;
      const x2 = pts[1].x;
      const y2 = pts[1].y;

      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      const rx = Math.abs(x2 - x1) / 2;
      const ry = Math.abs(y2 - y1) / 2;

      if (rx === 0 || ry === 0) return false;

      // Normalize point to unit circle
      const normDist = Math.hypot((px - cx) / rx, (py - cy) / ry);
      const scaledThreshold = threshold / Math.min(rx, ry);

      // Near circumference
      if (Math.abs(normDist - 1) <= scaledThreshold) return true;

      // Interior if filled
      if (element.fill && element.fill !== 'none' && normDist <= 1) return true;

      return false;
    }

    default:
      return false;
  }
}
