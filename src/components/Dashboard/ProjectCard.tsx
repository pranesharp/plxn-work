import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../../types';
import { useProjectContext } from '../../context/ProjectContext';
import { 
  Pin, 
  MoreHorizontal, 
  Copy, 
  Trash2, 
  Download, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  Calendar 
} from 'lucide-react';
import { exportProjectToJson } from '../../utils/storage';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const { togglePinProject, duplicateProject, deleteProject, updateProjectMeta } = useProjectContext();
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      updateProjectMeta(project.id, { title: titleInput.trim() });
      setIsRenaming(false);
    }
  };

  // Stats calculation
  const totalNodes = project.nodes.length;
  const taskNodes = project.nodes.filter((n) => n.type === 'task');
  const completedTasks = taskNodes.filter((n) => n.status === 'done').length;
  const taskProgress = taskNodes.length > 0 ? Math.round((completedTasks / taskNodes.length) * 100) : 0;

  // Date format
  const updatedDate = new Date(project.updatedAt);
  const dateStr = updatedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onOpen}
      className="group relative bg-white dark:bg-[#1A1A1E] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Color Accent Bar & Quick Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: project.color || '#3B82F6' }}
            />
            {/* Zero-Pill Unboxed Metadata with · separator */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <span>{project.tags?.[0] || 'Workspace'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{dateStr}</span>
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => togglePinProject(project.id)}
              title={project.pinned ? 'Unpin' : 'Pin to top'}
              className={`p-1.5 rounded-lg transition-colors ${
                project.pinned
                  ? 'text-amber-500 fill-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${project.pinned ? 'fill-current' : ''}`} />
            </button>

            {/* Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                title="More actions"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-7 w-44 bg-white dark:bg-[#1E1E22] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 py-1 text-xs">
                  <button
                    onClick={() => {
                      setIsRenaming(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Rename Plan</span>
                  </button>

                  <button
                    onClick={() => {
                      duplicateProject(project.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={() => {
                      exportProjectToJson(project);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Export as JSON</span>
                  </button>

                  <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete plan "${project.title}"?`)) {
                        deleteProject(project.id);
                      }
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
        </div>

        {/* Title or Inline Rename */}
        {isRenaming ? (
          <form
            onSubmit={handleSaveRename}
            onClick={(e) => e.stopPropagation()}
            className="mb-2"
          >
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveRename}
              className="w-full text-base font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2 py-1 focus:outline-none"
            />
          </form>
        ) : (
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
            {project.title}
          </h3>
        )}

        {/* Description */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Card Footer: Progress & Metrics */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-mono tabular-nums text-[11px]">
              {completedTasks}/{taskNodes.length} tasks
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-mono tabular-nums text-[11px]">
              {totalNodes} nodes
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-300"
            style={{ width: `${taskNodes.length > 0 ? taskProgress : Math.min(totalNodes * 15, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
