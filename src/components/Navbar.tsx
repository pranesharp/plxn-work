import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, 
  Moon, 
  HelpCircle, 
  Download, 
  PanelRight, 
  ChevronLeft, 
  Check, 
  Search,
  Cloud,
  CloudCheck,
  User as UserIcon,
  LogIn
} from 'lucide-react';
import { ShortcutsModal } from './Modals/ShortcutsModal';
import { ExportImportModal } from './Modals/ExportImportModal';
import { AuthModal } from './Modals/AuthModal';

interface NavbarProps {
  isSidePanelOpen: boolean;
  onToggleSidePanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isSidePanelOpen, onToggleSidePanel }) => {
  const {
    viewMode,
    activeProject,
    closeProject,
    theme,
    setTheme,
    updateProjectMeta,
    isSaving,
    cloudSyncStatus,
    searchQuery,
    setSearchQuery,
  } = useProjectContext();

  const { user } = useAuth();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleStartEditTitle = () => {
    if (activeProject) {
      setTitleInput(activeProject.title);
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeProject && titleInput.trim()) {
      updateProjectMeta(activeProject.id, { title: titleInput.trim() });
      setIsEditingTitle(false);
    }
  };

  return (
    <>
      <header className="h-14 border-b border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-40 select-none">
        {/* Zone 1: Brand & Breadcrumb Trail */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={closeProject}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Tilted left 45 degree Bold and wide-fonted P subscript x logo */}
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 shadow-sm group-hover:scale-105 transition-all overflow-hidden">
              <div
                className="inline-flex items-baseline select-none font-black font-mono"
                style={{
                  transform: 'rotate(-45deg)',
                  letterSpacing: '0.04em',
                }}
              >
                <span className="text-sm font-black leading-none">P</span>
                <sub className="text-[10px] font-black lowercase leading-none -ml-0.5 relative top-0.5">x</sub>
              </div>
            </div>
            <span className="text-base font-extrabold tracking-wider text-neutral-900 dark:text-neutral-100 font-sans">
              PLXN
            </span>
          </div>

          {/* Breadcrumb if in Canvas Mode */}
          {viewMode === 'canvas' && activeProject && (
            <>
              <span className="text-neutral-300 dark:text-neutral-700 font-light">/</span>
              
              <button
                onClick={closeProject}
                className="hidden sm:flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                title="Back to all plans"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Plans</span>
              </button>

              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700 font-light">/</span>

              {/* Editable Plan Title */}
              {isEditingTitle ? (
                <form onSubmit={handleSaveTitle} className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onBlur={handleSaveTitle}
                    className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5 focus:outline-none"
                  />
                  <button type="submit" className="text-neutral-500 hover:text-neutral-900">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={handleStartEditTitle}
                  title="Click to rename"
                  className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-1.5 py-1 rounded transition-colors truncate max-w-[140px] sm:max-w-xs text-left"
                >
                  {activeProject.title}
                </button>
              )}

              {/* Cloud Sync & Autosave Status */}
              <div
                onClick={() => setIsAuthOpen(true)}
                title={
                  user
                    ? cloudSyncStatus === 'synced'
                      ? 'Saved & Synced to Firestore Database'
                      : 'Syncing to Cloud Database...'
                    : 'Saved locally in browser. Click to sign in and sync to Firestore database.'
                }
                className="hidden lg:flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono pl-1 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
              >
                {user ? (
                  cloudSyncStatus === 'synced' ? (
                    <>
                      <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Cloud Synced</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                      <span>Syncing...</span>
                    </>
                  )
                ) : (
                  <>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                    <span>Saved locally</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Zone 2: Global Search (when on Dashboard) */}
        {viewMode === 'dashboard' && (
          <div className="hidden md:flex items-center max-w-sm w-full mx-4">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans, tasks, notes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>
          </div>
        )}

        {/* Zone 3: Actions & Utility buttons */}
        <div className="flex items-center gap-1.5">
          {/* Shortcuts Help */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard shortcuts (?)"
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Export / Import Modal */}
          <button
            onClick={() => setIsExportImportOpen(true)}
            title="Data Export & Import"
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              title={`Logged in as ${user.displayName || user.email || 'User'}`}
              className="flex items-center gap-1.5 p-1 pl-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs font-medium"
            >
              <span className="truncate max-w-[80px] hidden sm:inline text-neutral-700 dark:text-neutral-300">
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Account'}
              </span>
              <div className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-[10px] shrink-0">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              title="Sign in to sync your plans across devices"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Canvas Mode: Side panel toggle */}
          {viewMode === 'canvas' && (
            <button
              onClick={onToggleSidePanel}
              title="Toggle Project Inspector"
              className={`p-2 rounded-xl transition-colors ml-1 ${
                isSidePanelOpen
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <PanelRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
      />
    </>
  );
};
