import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Project, NodeItem, Connection, ConnectionHandle, NodeType, CanvasViewport } from '../../types';
import { useProjectContext } from '../../context/ProjectContext';
import { screenToCanvas, snapToGrid, getCanvasBounds, calculateBezierCurve, getNodeHandlePosition } from '../../utils/canvasMath';
import { NodeWrapper } from './Nodes/NodeWrapper';
import { NoteNode } from './Nodes/NoteNode';
import { TaskNode } from './Nodes/TaskNode';
import { MilestoneNode } from './Nodes/MilestoneNode';
import { LinkNode } from './Nodes/LinkNode';
import { ImageNode } from './Nodes/ImageNode';
import { ConnectionLine } from './ConnectionLine';
import { CanvasToolbar } from './CanvasToolbar';
import { Minimap } from './Minimap';
import { SidePanel } from './SidePanel';

interface CanvasProps {
  project: Project;
  isSidePanelOpen: boolean;
  onToggleSidePanel: () => void;
}

interface DraftConnection {
  sourceNodeId: string;
  sourceHandle: ConnectionHandle;
  currentMousePos: { x: number; y: number };
}

export const Canvas: React.FC<CanvasProps> = ({ project, isSidePanelOpen, onToggleSidePanel }) => {
  const {
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    addConnection,
    selectedNodeId,
    setSelectedNodeId,
    selectedConnectionId,
    setSelectedConnectionId,
    canUndo,
    canRedo,
    undo,
    redo,
    updateViewport,
  } = useProjectContext();

  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport state
  const [viewport, setViewport] = useState<CanvasViewport>(
    project.viewport || { x: 100, y: 100, zoom: 0.95 }
  );

  // Canvas interaction flags
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; vpX: number; vpY: number } | null>(null);

  // Node dragging
  const [draggingNode, setDraggingNode] = useState<{
    nodeId: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Snap to grid
  const [snapEnabled, setSnapEnabled] = useState(true);

  // Draft connection
  const [draftConnection, setDraftConnection] = useState<DraftConnection | null>(null);

  // Keep project.viewport synced with local state
  useEffect(() => {
    if (project.viewport) {
      setViewport(project.viewport);
    }
  }, [project.id]);

  // Sync back to project debounce
  const syncViewportToProject = useCallback(
    (newVp: CanvasViewport) => {
      setViewport(newVp);
      updateViewport(newVp);
    },
    [updateViewport]
  );

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside input/textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        setSpacePressed(true);
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedNodeId) {
          duplicateNode(selectedNodeId);
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
        }
      }

      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedConnectionId(null);
        setDraftConnection(null);
      }

      if (e.key.toLowerCase() === 'n') {
        handleQuickAddNode('note');
      } else if (e.key.toLowerCase() === 't') {
        handleQuickAddNode('task');
      } else if (e.key.toLowerCase() === 'm') {
        handleQuickAddNode('milestone');
      } else if (e.key.toLowerCase() === 'l') {
        handleQuickAddNode('link');
      } else if (e.key === '0') {
        handleZoomToFit();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedNodeId, duplicateNode, deleteNode, setSelectedNodeId, setSelectedConnectionId, undo, redo]);

  // Center screen coordinates for spawning new nodes
  const getCanvasCenterPosition = useCallback(() => {
    if (!containerRef.current) return { x: 300, y: 200 };
    const rect = containerRef.current.getBoundingClientRect();
    const centerScreenX = rect.left + rect.width / 2;
    const centerScreenY = rect.top + rect.height / 2;
    return screenToCanvas(centerScreenX, centerScreenY, rect, viewport);
  }, [viewport]);

  const handleQuickAddNode = useCallback(
    (type: NodeType, coords?: { x: number; y: number }) => {
      const pos = coords || getCanvasCenterPosition();
      const snappedX = snapToGrid(pos.x - 140, snapEnabled);
      const snappedY = snapToGrid(pos.y - 60, snapEnabled);

      let title = 'New Note';
      if (type === 'task') title = 'New Task';
      if (type === 'milestone') title = 'New Milestone';
      if (type === 'link') title = 'Resource Link';
      if (type === 'image') title = 'Visual Attachment';

      addNode({
        type,
        title,
        x: snappedX,
        y: snappedY,
        width: type === 'milestone' ? 320 : 300,
        color: type === 'task' ? 'sky' : type === 'milestone' ? 'amber' : type === 'link' ? 'lavender' : 'sage',
        status: type === 'task' ? 'todo' : undefined,
        milestoneStatus: type === 'milestone' ? 'planned' : undefined,
        progress: type === 'milestone' ? 0 : undefined,
      });
    },
    [getCanvasCenterPosition, snapEnabled, addNode]
  );

  // Wheel Zoom & Pan
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (e.ctrlKey || e.metaKey) {
      // Zoom centered on cursor
      const zoomFactor = -e.deltaY * 0.0015;
      const newZoom = Math.min(Math.max(viewport.zoom + zoomFactor, 0.25), 2.5);

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Adjust pan so mouse point remains stationary
      const newX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
      const newY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);

      syncViewportToProject({ x: newX, y: newY, zoom: newZoom });
    } else {
      // Normal pan with trackpad/wheel
      syncViewportToProject({
        ...viewport,
        x: viewport.x - e.deltaX,
        y: viewport.y - e.deltaY,
      });
    }
  };

  // Canvas Mouse Down (Pan or deselect)
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only pan if left click on empty canvas or middle click or space pressed
    if (e.button === 1 || (e.button === 0 && (spacePressed || e.target === containerRef.current || (e.target as HTMLElement).id === 'canvas-grid-plane'))) {
      setIsPanning(true);
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        vpX: viewport.x,
        vpY: viewport.y,
      };
      setSelectedNodeId(null);
      setSelectedConnectionId(null);
    }
  };

  // Canvas Mouse Move (Panning, Dragging Node, or Drawing Connection)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Panning
    if (isPanning && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.clientX;
      const dy = e.clientY - panStartRef.current.clientY;
      setViewport({
        ...viewport,
        x: panStartRef.current.vpX + dx,
        y: panStartRef.current.vpY + dy,
      });
      return;
    }

    // Node Dragging
    if (draggingNode && containerRef.current) {
      const dx = (e.clientX - draggingNode.startX) / viewport.zoom;
      const dy = (e.clientY - draggingNode.startY) / viewport.zoom;

      let nextX = draggingNode.origX + dx;
      let nextY = draggingNode.origY + dy;

      if (snapEnabled) {
        nextX = snapToGrid(nextX, true);
        nextY = snapToGrid(nextY, true);
      }

      updateNode(draggingNode.nodeId, { x: nextX, y: nextY });
      return;
    }

    // Drawing Draft Connection
    if (draftConnection && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasCoords = screenToCanvas(e.clientX, e.clientY, rect, viewport);
      setDraftConnection({
        ...draftConnection,
        currentMousePos: canvasCoords,
      });
    }
  };

  // Mouse Up
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      updateViewport(viewport);
    }

    if (draggingNode) {
      // Record history on drag end
      const node = project.nodes.find((n) => n.id === draggingNode.nodeId);
      if (node) {
        updateNode(node.id, { x: node.x, y: node.y }, true);
      }
      setDraggingNode(null);
    }

    if (draftConnection) {
      setDraftConnection(null);
    }
  };

  // Start dragging a node
  const handleStartDragNode = (e: React.MouseEvent, node: NodeItem) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setSelectedConnectionId(null);
    setDraggingNode({
      nodeId: node.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.x,
      origY: node.y,
    });
  };

  // Start Connection
  const handleStartConnection = (nodeId: string, handle: ConnectionHandle, e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasCoords = screenToCanvas(e.clientX, e.clientY, rect, viewport);
    setDraftConnection({
      sourceNodeId: nodeId,
      sourceHandle: handle,
      currentMousePos: canvasCoords,
    });
  };

  // End Connection on target node port
  const handleEndConnection = (targetNodeId: string, handle: ConnectionHandle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (draftConnection && draftConnection.sourceNodeId !== targetNodeId) {
      addConnection({
        sourceNodeId: draftConnection.sourceNodeId,
        sourceHandle: draftConnection.sourceHandle,
        targetNodeId,
        targetHandle: handle,
      });
    }
    setDraftConnection(null);
  };

  // HTML5 Drag-and-Drop from palette onto canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('text/plxn-node-type') as NodeType;
    if (nodeType && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const coords = screenToCanvas(e.clientX, e.clientY, rect, viewport);
      handleQuickAddNode(nodeType, coords);
    }
  };

  // Zoom Controls
  const handleZoomIn = () => {
    const newZoom = Math.min(viewport.zoom + 0.15, 2.5);
    syncViewportToProject({ ...viewport, zoom: newZoom });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(viewport.zoom - 0.15, 0.25);
    syncViewportToProject({ ...viewport, zoom: newZoom });
  };

  const handleResetZoom = () => {
    syncViewportToProject({ ...viewport, zoom: 1 });
  };

  const handleZoomToFit = () => {
    if (!containerRef.current || project.nodes.length === 0) return;
    const bounds = getCanvasBounds(project.nodes, 140);
    const rect = containerRef.current.getBoundingClientRect();

    const scaleX = rect.width / bounds.width;
    const scaleY = rect.height / bounds.height;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.3), 1.2);

    const newX = rect.width / 2 - (bounds.minX + bounds.width / 2) * newZoom;
    const newY = rect.height / 2 - (bounds.minY + bounds.height / 2) * newZoom;

    syncViewportToProject({ x: newX, y: newY, zoom: newZoom });
  };

  // Auto-Tidy Layout: arranges nodes in clean, spaced pipeline tracks
  const handleTidyLayout = () => {
    if (project.nodes.length === 0) return;
    const startX = 100;
    let currX = startX;
    let currY = 120;
    const colSpacing = 360;
    const rowSpacing = 220;

    project.nodes.forEach((n, idx) => {
      updateNode(n.id, {
        x: currX,
        y: currY,
      }, idx === 0);

      currY += rowSpacing;
      if (currY > 600) {
        currY = 120;
        currX += colSpacing;
      }
    });

    handleZoomToFit();
  };

  // Double click canvas to quick add Note
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (e.target === containerRef.current || (e.target as HTMLElement).id === 'canvas-grid-plane') {
      const rect = containerRef.current.getBoundingClientRect();
      const coords = screenToCanvas(e.clientX, e.clientY, rect, viewport);
      handleQuickAddNode('note', coords);
    }
  };

  // Draft Connection Bezier Path
  let draftPathData = '';
  if (draftConnection) {
    const sourceNode = project.nodes.find((n) => n.id === draftConnection.sourceNodeId);
    if (sourceNode) {
      const sourcePos = getNodeHandlePosition(sourceNode, draftConnection.sourceHandle);
      draftPathData = calculateBezierCurve(
        sourcePos.x,
        sourcePos.y,
        draftConnection.currentMousePos.x,
        draftConnection.currentMousePos.y,
        draftConnection.sourceHandle,
        'left'
      );
    }
  }

  const containerRect = containerRef.current?.getBoundingClientRect() || { width: 1200, height: 800 };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full h-[calc(100vh-56px)] overflow-hidden select-none bg-[#F9F9F7] dark:bg-[#141416] ${
        spacePressed ? 'cursor-grab' : isPanning ? 'cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Floating Canvas Palette & Controls */}
      <CanvasToolbar
        onAddNode={handleQuickAddNode}
        snapEnabled={snapEnabled}
        onToggleSnap={() => setSnapEnabled(!snapEnabled)}
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onZoomToFit={handleZoomToFit}
        onTidyLayout={handleTidyLayout}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      {/* The 2D Infinite Transform Plane */}
      <div
        id="canvas-grid-plane"
        style={{
          transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
        }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* SVG Layer for Connections */}
        <svg
          className="absolute overflow-visible top-0 left-0 w-full h-full pointer-events-none"
          style={{ width: '1px', height: '1px' }}
        >
          {/* Render Connections */}
          {project.connections.map((conn) => {
            const src = project.nodes.find((n) => n.id === conn.sourceNodeId);
            const tgt = project.nodes.find((n) => n.id === conn.targetNodeId);
            if (!src || !tgt) return null;

            return (
              <ConnectionLine
                key={conn.id}
                connection={conn}
                sourceNode={src}
                targetNode={tgt}
                isSelected={selectedConnectionId === conn.id}
                onSelect={(e) => {
                  e.stopPropagation();
                  setSelectedConnectionId(conn.id);
                  setSelectedNodeId(null);
                }}
              />
            );
          })}

          {/* Render In-Progress Draft Connection */}
          {draftConnection && (
            <path
              d={draftPathData}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Nodes Layer */}
        <div className="absolute top-0 left-0 pointer-events-auto">
          {project.nodes.map((node) => (
            <NodeWrapper
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
                setSelectedConnectionId(null);
              }}
              onStartDrag={handleStartDragNode}
              onStartConnection={handleStartConnection}
              onEndConnection={handleEndConnection}
            >
              {node.type === 'note' && <NoteNode node={node} />}
              {node.type === 'task' && <TaskNode node={node} />}
              {node.type === 'milestone' && <MilestoneNode node={node} />}
              {node.type === 'link' && <LinkNode node={node} />}
              {node.type === 'image' && <ImageNode node={node} />}
            </NodeWrapper>
          ))}
        </div>
      </div>

      {/* Grid Dot Overlay (Visual feedback for space and scale) */}
      <div
        className="absolute inset-0 pointer-events-none canvas-grid-dots opacity-70"
        style={{
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        }}
      />

      {/* Minimap in corner */}
      <Minimap
        nodes={project.nodes}
        viewport={viewport}
        containerWidth={containerRect.width}
        containerHeight={containerRect.height}
        onNavigate={(newX, newY) => {
          syncViewportToProject({ ...viewport, x: newX, y: newY });
        }}
      />

      {/* Collapsible Side Panel */}
      <SidePanel
        project={project}
        isOpen={isSidePanelOpen}
        onClose={onToggleSidePanel}
      />
    </div>
  );
};
