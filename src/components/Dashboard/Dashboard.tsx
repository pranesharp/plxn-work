import React, { useState, useMemo } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { ProjectCard } from './ProjectCard';
import { NewProjectModal } from './NewProjectModal';
import { AuthModal } from '../Modals/AuthModal';
import { 
  Plus, 
  Search, 
  Pin, 
  Clock, 
  Layers, 
  FolderKanban, 
  Tag as TagIcon, 
  ArrowUpDown, 
  CheckCircle2, 
  Sparkles, 
  Grid,
  Cloud,
  CloudCheck,
  ShieldCheck
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { projects, openProject, searchQuery, setSearchQuery, cloudSyncStatus } = useProjectContext();
  const { user } = useAuth();
  const [filterMode, setFilterMode] = useState<'all' | 'pinned' | 'recent'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'progress'>('recent');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Collect all unique tags across projects
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      (p.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [projects]);

  // Aggregate stats across all projects
  const totalTasks = useMemo(() => {
    let total = 0;
    let done = 0;
    projects.forEach((p) => {
      const tasks = p.nodes.filter((n) => n.type === 'task');
      total += tasks.length;
      done += tasks.filter((n) => n.status === 'done').length;
    });
    return { total, done };
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // Filter by mode
    if (filterMode === 'pinned') {
      list = list.filter((p) => p.pinned);
    } else if (filterMode === 'recent') {
      const oneWeekAgo = Date.now() - 7 * 86400000;
      list = list.filter((p) => p.updatedAt >= oneWeekAgo);
    }

    // Filter by tag
    if (selectedTag) {
      list = list.filter((p) => (p.tags || []).includes(selectedTag));
    }

    // Search query: searches title, description, tags, AND node contents!
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        const matchesTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
        const matchesNodes = p.nodes.some(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            (n.content && n.content.toLowerCase().includes(q))
        );
        return matchesTitle || matchesDesc || matchesTags || matchesNodes;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'progress') {
        const getPct = (p: typeof a) => {
          const t = p.nodes.filter((n) => n.type === 'task');
          return t.length > 0 ? t.filter((n) => n.status === 'done').length / t.length : 0;
        };
        return getPct(b) - getPct(a);
      }
      // default: recent
      return b.updatedAt - a.updatedAt;
    });

    return list;
  }, [projects, filterMode, selectedTag, searchQuery, sortBy]);

  return (
    <div className="flex w-full h-[calc(100vh-56px)] overflow-hidden select-none bg-[#FBFBF9] dark:bg-[#141416]">
      {/* Left Navigation Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-[#18181C]/70 p-4 space-y-6 shrink-0">
        {/* Navigation Categories */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-2">
            Navigation
          </span>

          <button
            onClick={() => {
              setFilterMode('all');
              setSelectedTag(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              filterMode === 'all' && !selectedTag
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              <span>All Plans</span>
            </div>
            <span className="font-mono tabular-nums text-[11px]">{projects.length}</span>
          </button>

          <button
            onClick={() => {
              setFilterMode('pinned');
              setSelectedTag(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              filterMode === 'pinned' && !selectedTag
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4" />
              <span>Pinned</span>
            </div>
            <span className="font-mono tabular-nums text-[11px]">
              {projects.filter((p) => p.pinned).length}
            </span>
          </button>

          <button
            onClick={() => {
              setFilterMode('recent');
              setSelectedTag(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              filterMode === 'recent' && !selectedTag
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Recent (7d)</span>
            </div>
          </button>
        </div>

        {/* Tags Section */}
        {allTags.length > 0 && (
          <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-2">
              Workspace Tags
            </span>

            <div className="space-y-0.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedTag === tag
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <TagIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">{tag}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[10px] text-neutral-400">
                    {projects.filter((p) => (p.tags || []).includes(tag)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Summary Card */}
        <div className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/80 space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Execution Summary</span>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Tasks Finished</span>
            <span className="font-mono tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
              {totalTasks.done}/{totalTasks.total}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${totalTasks.total > 0 ? (totalTasks.done / totalTasks.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Cloud Sync Status Card */}
        <div
          onClick={() => setIsAuthModalOpen(true)}
          className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/80 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {user ? (
                <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Cloud className="w-3.5 h-3.5 text-neutral-400" />
              )}
              <span>{user ? 'Cloud Database' : 'Offline / Local'}</span>
            </div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
              {user ? 'Synced' : 'Connect'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-snug">
            {user
              ? `Connected to Firestore (${user.email || 'Cloud Session'})`
              : 'Sign in to sync your plans across devices and browsers.'}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl w-full mx-auto space-y-6">
          {/* Top Row: Title, Quick Actions & New Plan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Workspace Plans
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Visual pipeline canvases, execution workflows, and spatial plans.
              </p>
            </div>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-semibold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Plan</span>
            </button>
          </div>

          {/* Search, Filter Tabs & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans, tasks, notes, milestones..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Tabs & Sort Dropdown */}
            <div className="flex items-center gap-2">
              {/* Segmented Filter Control */}
              <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl text-xs">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filterMode === 'all'
                      ? 'bg-white dark:bg-[#1E1E22] text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMode('pinned')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filterMode === 'pinned'
                      ? 'bg-white dark:bg-[#1E1E22] text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  Pinned
                </button>
                <button
                  onClick={() => setFilterMode('recent')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filterMode === 'recent'
                      ? 'bg-white dark:bg-[#1E1E22] text-neutral-900 dark:text-neutral-100 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  Recent
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-600 dark:text-neutral-400 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent focus:outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="recent">Recently Modified</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                  <option value="progress">Completion Rate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Tag Filter Indicator */}
          {selectedTag && (
            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <span>Filtering by tag:</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                #{selectedTag}
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 underline ml-1"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Project Cards Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => openProject(project.id)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-white/40 dark:bg-neutral-900/30 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                {searchQuery || selectedTag ? 'No matching plans found' : 'No plans created yet'}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mb-5 leading-relaxed">
                {searchQuery || selectedTag
                  ? 'Try adjusting your search terms or clearing active filters to find what you need.'
                  : 'Get started by creating your first infinite canvas plan or choose from prebuilt workflow templates.'}
              </p>
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Plan</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
