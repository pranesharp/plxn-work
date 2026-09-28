import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider, useProjectContext } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Canvas } from './components/Canvas/Canvas';

const MainLayout: React.FC = () => {
  const { viewMode, activeProject } = useProjectContext();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#FBFBF9] dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <Navbar
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
      />

      <div className="flex-1 w-full h-[calc(100vh-56px)] overflow-hidden relative">
        {viewMode === 'dashboard' || !activeProject ? (
          <Dashboard />
        ) : (
          <Canvas
            project={activeProject}
            isSidePanelOpen={isSidePanelOpen}
            onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
          />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MainLayout />
      </ProjectProvider>
    </AuthProvider>
  );
}
