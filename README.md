# PLXN ($P_x$)

  A minimalist visual project planner and infinite canvas workspace designed to turn scattered ideas into structured, actionable pipelines.
                                           
  Online link access estas : https://plxn-work.netlify.app/ (hosted for free on netlify).
    (firebase cloud for cross-platform working)

<img width="1919" height="1045" alt="image" src="https://github.com/user-attachments/assets/1116f591-2a36-4d78-b118-54a81f9bb038" />



## Overview

PLXN lets you map out complex projects spatially rather than getting lost in rigid tables or linear task lists. Arrange notes, tasks, checklists, and milestones on an infinite 2D canvas, link dependencies with directional flow lines, and track project execution progress in real time.

## Key Features

- **Infinite Spatial Canvas**: Freely pan, zoom (25%–250%), and snap nodes to a clean 24px grid.
- **Node Ecosystem**:
  - **Tasks**: Checklists, assignees, due dates, statuses (*To-Do*, *In Progress*, *Done*, *Blocked*), and live progress bars.
  - **Milestones**: Major goals, target dates, and phase status.
  - **Notes & Links**: Rich markdown-styled thoughts and external documentation references.
- **Directional Connectors**: Link cards via 4 directional anchor ports with smooth bezier curves, straight lines, or orthogonal paths (solid, dashed, or animated pulses).
- **Workspace Dashboard**: Filter projects by tags, pinned items, or recent updates, with global search across all plans and cards.
- **Workflow Templates**: Quick-start blueprints including *Product Launch*, *Kanban Sprint*, *Sci-Fi Storyboard*, and *Weekly Focus*.
- **Offline-First & Cloud Sync**: Operates entirely client-side via local storage, with optional Google/Email authentication and automatic real-time sync to **Google Cloud Firestore**.
- **Dark & Light Mode**: Clean, distraction-free aesthetic with instant zero-flash theme persistence and adaptive dot-grid background.
- **Data Portability**: Full Undo/Redo history (`Cmd+Z` / `Cmd+Shift+Z`) and one-click JSON workspace export and import.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Cloud Backend**: [Firebase](https://firebase.google.com/) (Authentication & Cloud Firestore)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd plxn

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

```bash
npm run build
```

###Attributes

  *Built with the help of gemini3 flash. Initially Built as personal project for personal workflow/project planning.*

## License

MIT
