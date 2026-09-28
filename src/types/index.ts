export type NodeType = 'note' | 'task' | 'milestone' | 'link' | 'image';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export type NodeColor = 
  | 'neutral'
  | 'sage'
  | 'sky'
  | 'amber'
  | 'lavender'
  | 'rose'
  | 'slate';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface NodeItem {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height?: number;
  title: string;
  color: NodeColor;
  locked?: boolean;
  zIndex?: number;
  tags?: string[];
  
  // Note specific
  content?: string;
  checklist?: ChecklistItem[];

  // Task specific
  status?: TaskStatus;
  dueDate?: string;
  priority?: Priority;
  assignee?: string;

  // Milestone specific
  targetDate?: string;
  milestoneStatus?: 'planned' | 'in-progress' | 'achieved';
  progress?: number;

  // Link specific
  url?: string;
  linkDescription?: string;

  // Image specific
  imageUrl?: string;
  caption?: string;
}

export type ConnectionHandle = 'top' | 'right' | 'bottom' | 'left';

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourceHandle?: ConnectionHandle;
  targetNodeId: string;
  targetHandle?: ConnectionHandle;
  label?: string;
  color?: string;
  animated?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  text: string;
  type: 'create' | 'update' | 'delete' | 'milestone' | 'connect';
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  notes: string;
  nodes: NodeItem[];
  connections: Connection[];
  activity: ActivityLog[];
  viewport: CanvasViewport;
}

export type ViewMode = 'dashboard' | 'canvas';
