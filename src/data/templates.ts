import { Project } from '../types';

function createUniqueTemplateId(prefix: string): string {
  return `proj-${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  tags: string[];
  createProject: () => Project;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'product-launch',
    name: 'Product Launch Pipeline',
    category: 'Product & Tech',
    description: 'End-to-end launch journey from product discovery and development to beta testing, PR blitz, and global launch.',
    icon: 'Rocket',
    color: '#3B82F6',
    tags: ['Launch', 'Roadmap', 'Milestone', 'SaaS'],
    createProject: () => ({
      id: createUniqueTemplateId('launch'),
      title: 'Global Product Launch 2.0',
      description: 'Q4 flagship release pipeline with milestones, beta feedback loop, and go-to-market campaign.',
      icon: 'Rocket',
      color: '#3B82F6',
      pinned: true,
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now() - 3600000 * 2,
      tags: ['Launch', 'Q4', 'Marketing', 'Roadmap'],
      notes: 'Key Objective: Deliver v2.0 with sub-100ms latency, zero critical security findings, and onboard 50 tier-1 beta partners.',
      viewport: { x: 80, y: 100, zoom: 0.85 },
      activity: [
        { id: 'act-1', timestamp: Date.now() - 86400000 * 2, text: 'Created project from Product Launch template', type: 'create' },
        { id: 'act-2', timestamp: Date.now() - 86400000, text: 'Completed Core Engine Refactor task', type: 'update' },
        { id: 'act-3', timestamp: Date.now() - 3600000 * 2, text: 'Achieved Phase 1 Milestone: Specs Locked', type: 'milestone' }
      ],
      nodes: [
        {
          id: 'node-m1',
          type: 'milestone',
          title: 'Phase 1: Architecture & Specs',
          x: 100,
          y: 120,
          width: 320,
          color: 'neutral',
          targetDate: '2026-10-15',
          milestoneStatus: 'achieved',
          progress: 100,
          tags: ['Phase 1']
        },
        {
          id: 'node-t1',
          type: 'task',
          title: 'PRD & Technical Specifications',
          x: 100,
          y: 280,
          width: 300,
          color: 'slate',
          status: 'done',
          priority: 'high',
          dueDate: '2026-10-10',
          assignee: 'Elena Rostova',
          tags: ['Product']
        },
        {
          id: 'node-n1',
          type: 'note',
          title: 'Design Invariants & Principles',
          x: 100,
          y: 450,
          width: 300,
          color: 'sage',
          content: 'Keep canvas latency under 16ms (60fps). Minimalist NotebookLM aesthetic with zero-pill metadata and calm tones.',
          checklist: [
            { id: 'c1', text: 'Contrast ratio >= 4.5:1 verified', done: true },
            { id: 'c2', text: 'Keyboard shortcuts mapped', done: true },
            { id: 'c3', text: 'Offline IndexedDB autosave', done: true }
          ]
        },
        {
          id: 'node-m2',
          type: 'milestone',
          title: 'Phase 2: Core Build & Engine',
          x: 520,
          y: 120,
          width: 320,
          color: 'sky',
          targetDate: '2026-11-05',
          milestoneStatus: 'in-progress',
          progress: 65,
          tags: ['Phase 2']
        },
        {
          id: 'node-t2',
          type: 'task',
          title: 'WebGL & SVG Bezier Router',
          x: 520,
          y: 280,
          width: 300,
          color: 'sky',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2026-10-28',
          assignee: 'David Chen',
          tags: ['Frontend']
        },
        {
          id: 'node-l1',
          type: 'link',
          title: 'Figma Design System & Components',
          x: 520,
          y: 450,
          width: 300,
          color: 'lavender',
          url: 'https://figma.com/@plxn-design-system',
          linkDescription: 'Master component library including canvas nodes, connectors, and color swatches.'
        },
        {
          id: 'node-m3',
          type: 'milestone',
          title: 'Phase 3: Beta & Go-To-Market',
          x: 940,
          y: 120,
          width: 320,
          color: 'amber',
          targetDate: '2026-11-20',
          milestoneStatus: 'planned',
          progress: 15,
          tags: ['Phase 3']
        },
        {
          id: 'node-t3',
          type: 'task',
          title: 'Press Kit & Product Hunt Launch Assets',
          x: 940,
          y: 280,
          width: 300,
          color: 'rose',
          status: 'todo',
          priority: 'medium',
          dueDate: '2026-11-15',
          assignee: 'Marcus Vance',
          tags: ['GTM']
        },
        {
          id: 'node-img1',
          type: 'image',
          title: 'Hero Teaser Mockup',
          x: 940,
          y: 450,
          width: 320,
          color: 'neutral',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          caption: 'Visual workflow canvas preview for keynote presentation.'
        }
      ],
      connections: [
        { id: 'conn-1', sourceNodeId: 'node-m1', sourceHandle: 'right', targetNodeId: 'node-m2', targetHandle: 'left', label: 'specs approved', color: '#6366F1' },
        { id: 'conn-2', sourceNodeId: 'node-t1', sourceHandle: 'right', targetNodeId: 'node-t2', targetHandle: 'left', label: 'depends on', color: '#3B82F6' },
        { id: 'conn-3', sourceNodeId: 'node-m2', sourceHandle: 'right', targetNodeId: 'node-m3', targetHandle: 'left', label: 'gating milestone', color: '#F59E0B' },
        { id: 'conn-4', sourceNodeId: 'node-t2', sourceHandle: 'right', targetNodeId: 'node-t3', targetHandle: 'left', label: 'triggers QA & GTM', color: '#10B981' }
      ]
    })
  },
  {
    id: 'kanban-workflow',
    name: 'Visual Kanban Workflow',
    category: 'Agile & Team',
    description: 'Horizontal flow columns with connected work streams, wip limits, and state transitions.',
    icon: 'Kanban',
    color: '#10B981',
    tags: ['Kanban', 'Agile', 'Sprint'],
    createProject: () => ({
      id: createUniqueTemplateId('kanban'),
      title: 'Engineering Sprint Board',
      description: 'Continuous delivery workflow with connected stages, blockers, and task cards.',
      icon: 'Kanban',
      color: '#10B981',
      pinned: true,
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 3600000 * 4,
      tags: ['Sprint', 'Engineering', 'Active'],
      notes: 'WIP Limits: Max 3 items in In-Progress. Daily asynchronous standups at 09:30 AM.',
      viewport: { x: 60, y: 80, zoom: 0.9 },
      activity: [
        { id: 'act-1', timestamp: Date.now() - 86400000, text: 'Created Visual Kanban board', type: 'create' }
      ],
      nodes: [
        {
          id: 'k-col-1',
          type: 'milestone',
          title: '01. Backlog & Triage',
          x: 80,
          y: 100,
          width: 290,
          color: 'slate',
          targetDate: 'Ongoing',
          milestoneStatus: 'planned',
          progress: 20
        },
        {
          id: 'k-item-1',
          type: 'task',
          title: 'Implement Multi-node Lasso Selection',
          x: 80,
          y: 260,
          width: 290,
          color: 'neutral',
          status: 'todo',
          priority: 'medium',
          dueDate: '2026-10-18',
          assignee: 'Alex Ray'
        },
        {
          id: 'k-col-2',
          type: 'milestone',
          title: '02. In Progress (Active)',
          x: 440,
          y: 100,
          width: 290,
          color: 'sky',
          targetDate: 'Sprint 42',
          milestoneStatus: 'in-progress',
          progress: 50
        },
        {
          id: 'k-item-2',
          type: 'task',
          title: 'Canvas Pan & Zoom Inertia Smoothing',
          x: 440,
          y: 260,
          width: 290,
          color: 'sky',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2026-10-12',
          assignee: 'Sarah Lin'
        },
        {
          id: 'k-col-3',
          type: 'milestone',
          title: '03. Verification & Done',
          x: 800,
          y: 100,
          width: 290,
          color: 'sage',
          targetDate: 'Shipped',
          milestoneStatus: 'achieved',
          progress: 100
        },
        {
          id: 'k-item-3',
          type: 'task',
          title: 'IndexedDB LocalStorage Migration',
          x: 800,
          y: 260,
          width: 290,
          color: 'sage',
          status: 'done',
          priority: 'high',
          dueDate: '2026-10-01',
          assignee: 'Alex Ray'
        }
      ],
      connections: [
        { id: 'k-conn-1', sourceNodeId: 'k-item-1', sourceHandle: 'right', targetNodeId: 'k-item-2', targetHandle: 'left', label: 'promoted to sprint', color: '#3B82F6' },
        { id: 'k-conn-2', sourceNodeId: 'k-item-2', sourceHandle: 'right', targetNodeId: 'k-item-3', targetHandle: 'left', label: 'passed QA tests', color: '#10B981' }
      ]
    })
  },
  {
    id: 'story-narrative',
    name: 'Story & Narrative Architecture',
    category: 'Creative & Writing',
    description: 'Three-act narrative structure with character motivations, plot turning points, and thematic arcs.',
    icon: 'Feather',
    color: '#8B5CF6',
    tags: ['Narrative', 'Writing', 'Storyboarding'],
    createProject: () => ({
      id: createUniqueTemplateId('story'),
      title: 'Sci-Fi Novella: The Glass Meridian',
      description: 'Three-act plot blueprint exploring human consciousness transferred into light-based computing nodes.',
      icon: 'Feather',
      color: '#8B5CF6',
      pinned: false,
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now() - 3600000 * 12,
      tags: ['Fiction', 'Worldbuilding', 'Draft'],
      notes: 'Themes: Impermanence, digital memory degradation, and the cost of total connectivity.',
      viewport: { x: 50, y: 70, zoom: 0.85 },
      activity: [
        { id: 'act-1', timestamp: Date.now() - 86400000 * 3, text: 'Plotted Act I and Inciting Incident', type: 'create' }
      ],
      nodes: [
        {
          id: 'story-m1',
          type: 'milestone',
          title: 'Act I: The Meridian Outpost',
          x: 80,
          y: 100,
          width: 310,
          color: 'neutral',
          targetDate: 'Chapters 1-4',
          milestoneStatus: 'achieved',
          progress: 100
        },
        {
          id: 'story-n1',
          type: 'note',
          title: 'Protagonist: Dr. Julie Moreau',
          x: 80,
          y: 260,
          width: 310,
          color: 'lavender',
          content: 'A solitary quantum engineer operating deep-space optical observatory. Burdened by memories of Earth before the blackout.',
          checklist: [
            { id: 'sc1', text: 'Establish sensory isolation', done: true },
            { id: 'sc2', text: 'Discover the anomaly signal', done: true }
          ]
        },
        {
          id: 'story-m2',
          type: 'milestone',
          title: 'Act II: The Signal & Descent',
          x: 460,
          y: 100,
          width: 310,
          color: 'amber',
          targetDate: 'Chapters 5-11',
          milestoneStatus: 'in-progress',
          progress: 40
        },
        {
          id: 'story-n2',
          type: 'note',
          title: 'The Turning Point: The Mirror Protocol',
          x: 460,
          y: 260,
          width: 310,
          color: 'amber',
          content: 'The optical transmission is not a star flare—it is a conscious response echoing her late sister\'s journal entries verbatim.',
          checklist: [
            { id: 'sc3', text: 'Subvert military interference', done: true },
            { id: 'sc4', text: 'Decipher optical harmonic code', done: false }
          ]
        },
        {
          id: 'story-m3',
          type: 'milestone',
          title: 'Act III: Transmutation & Horizon',
          x: 840,
          y: 100,
          width: 310,
          color: 'rose',
          targetDate: 'Chapters 12-15',
          milestoneStatus: 'planned',
          progress: 0
        },
        {
          id: 'story-n3',
          type: 'note',
          title: 'Climax & Philosophical Resolution',
          x: 840,
          y: 260,
          width: 310,
          color: 'rose',
          content: 'Julie must choose whether to collapse the observatory array or merge the human archive into the interstellar grid.',
          checklist: [
            { id: 'sc5', text: 'Final voice log recorded', done: false }
          ]
        }
      ],
      connections: [
        { id: 's-conn-1', sourceNodeId: 'story-m1', sourceHandle: 'right', targetNodeId: 'story-m2', targetHandle: 'left', label: 'Inciting Incident', color: '#8B5CF6' },
        { id: 's-conn-2', sourceNodeId: 'story-m2', sourceHandle: 'right', targetNodeId: 'story-m3', targetHandle: 'left', label: 'Dark Night of Soul', color: '#EC4899' },
        { id: 's-conn-3', sourceNodeId: 'story-n1', sourceHandle: 'right', targetNodeId: 'story-n2', targetHandle: 'left', label: 'leads to discovery', color: '#F59E0B' }
      ]
    })
  },
  {
    id: 'weekly-sprint',
    name: 'Weekly Execution & Priority Matrix',
    category: 'Productivity',
    description: 'Weekly rhythmic planning with high-impact targets, focus blocks, and Friday retrospectives.',
    icon: 'Calendar',
    color: '#F59E0B',
    tags: ['Weekly', 'Priorities', 'Deep Work'],
    createProject: () => ({
      id: createUniqueTemplateId('sprint'),
      title: 'Current Sprint: High Leverage Focus',
      description: 'Weekly priorities, deep work blocks, and team deliverables.',
      icon: 'Calendar',
      color: '#F59E0B',
      pinned: false,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
      tags: ['Sprint', 'Priorities'],
      notes: 'Main rule: Only 1 primary needle-mover task per day. Protect 4 hours of morning deep work.',
      viewport: { x: 80, y: 90, zoom: 0.9 },
      activity: [
        { id: 'act-1', timestamp: Date.now() - 86400000, text: 'Created Weekly Focus sprint', type: 'create' }
      ],
      nodes: [
        {
          id: 'w-m1',
          type: 'milestone',
          title: 'Mon-Tue: Core Deliverable',
          x: 80,
          y: 100,
          width: 300,
          color: 'neutral',
          targetDate: 'Tuesday EOD',
          milestoneStatus: 'achieved',
          progress: 100
        },
        {
          id: 'w-t1',
          type: 'task',
          title: 'Complete Canvas Snapping Engine',
          x: 80,
          y: 260,
          width: 300,
          color: 'sage',
          status: 'done',
          priority: 'high',
          dueDate: 'Tuesday',
          assignee: 'Lead Engineer'
        },
        {
          id: 'w-m2',
          type: 'milestone',
          title: 'Wed-Thu: Polish & Review',
          x: 450,
          y: 100,
          width: 300,
          color: 'sky',
          targetDate: 'Thursday EOD',
          milestoneStatus: 'in-progress',
          progress: 50
        },
        {
          id: 'w-t2',
          type: 'task',
          title: 'Minimap Navigation & Viewport Sync',
          x: 450,
          y: 260,
          width: 300,
          color: 'sky',
          status: 'in-progress',
          priority: 'medium',
          dueDate: 'Thursday',
          assignee: 'Lead Engineer'
        },
        {
          id: 'w-m3',
          type: 'milestone',
          title: 'Friday: Demo & Retro',
          x: 820,
          y: 100,
          width: 300,
          color: 'amber',
          targetDate: 'Friday 4 PM',
          milestoneStatus: 'planned',
          progress: 0
        },
        {
          id: 'w-n1',
          type: 'note',
          title: 'Retro Prompts & Wins',
          x: 820,
          y: 260,
          width: 300,
          color: 'amber',
          content: 'Reflect on flow state hours vs context switches. What was surprisingly fast? What felt sticky?',
          checklist: [
            { id: 'r1', text: 'Record 2-min demo screencast', done: false },
            { id: 'r2', text: 'Document lessons learned', done: false }
          ]
        }
      ],
      connections: [
        { id: 'w-c1', sourceNodeId: 'w-m1', sourceHandle: 'right', targetNodeId: 'w-m2', targetHandle: 'left', color: '#3B82F6' },
        { id: 'w-c2', sourceNodeId: 'w-m2', sourceHandle: 'right', targetNodeId: 'w-m3', targetHandle: 'left', color: '#F59E0B' }
      ]
    })
  }
];
