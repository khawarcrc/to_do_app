This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel




================================================================================
  TODOFLOW - Next.js Todo List Application
  Project Overview & Documentation
================================================================================

Created: February 25, 2026
Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4


--------------------------------------------------------------------------------
  WHAT WAS BUILT
--------------------------------------------------------------------------------

A full-featured Todo List web application called "TodoFlow" with:
  - Light / Dark theme toggle with localStorage persistence
  - JSON file-based task storage (no database required)
  - Full CRUD operations via REST API routes
  - Priority system with visual indicators
  - Filtering, sorting, and searching of tasks
  - Time estimates and due date tracking
  - Overdue task detection
  - Statistics dashboard
  - Responsive layout (mobile, tablet, desktop)
  - Delete confirmation dialog
  - Tag support on tasks


--------------------------------------------------------------------------------
  FOLDER STRUCTURE
--------------------------------------------------------------------------------

to-do-list/
│
├── app/                          # Next.js App Router
│   ├── globals.css               # Global styles, CSS variables, dark mode, animations
│   ├── layout.tsx                # Root layout — mounts ThemeProvider
│   ├── page.tsx                  # Main page (client component, wires everything together)
│   └── api/
│       └── tasks/
│           ├── route.ts          # GET /api/tasks, POST /api/tasks
│           └── [id]/
│               └── route.ts     # GET, PUT, PATCH, DELETE /api/tasks/:id
│
├── components/                   # Reusable UI components
│   ├── ThemeToggle.tsx           # Sun/Moon button for switching themes
│   ├── PriorityBadge.tsx         # Colored badge showing task priority
│   ├── TimeEstimate.tsx          # Displays time estimate + due date with overdue warning
│   ├── StatsDashboard.tsx        # Task statistics cards + completion progress bar
│   ├── FilterBar.tsx             # Search input + priority/status/date filters + sort
│   ├── TaskCard.tsx              # Individual task card with edit/delete/toggle actions
│   ├── TaskList.tsx              # Renders list of TaskCards, handles empty/loading states
│   └── TaskForm.tsx              # Modal form for creating and editing tasks
│
├── contexts/
│   └── ThemeContext.tsx          # React context for theme state + ThemeProvider
│
├── hooks/
│   └── useTasks.ts               # Custom hook for API calls (fetch/add/edit/delete/toggle)
│                                 # Also exports filterAndSortTasks() and computeStats()
│
├── lib/
│   └── taskStorage.ts            # Server-side JSON file read/write with:
│                                 #   - Write queue (concurrency-safe)
│                                 #   - Auto backup (tasks.backup.json)
│                                 #   - Input validation
│                                 #   - CRUD: createTask, updateTask, deleteTask, toggleTaskStatus
│
├── types/
│   └── index.ts                  # All TypeScript interfaces and constants:
│                                 #   - Task interface
│                                 #   - TaskFormData, FilterState, SortState, TaskStats
│                                 #   - PRIORITY_CONFIG (labels, colors, emojis)
│                                 #   - STATUS_CONFIG (labels, colors)
│                                 #   - PRIORITY_ORDER (for sorting)
│
├── utils/
│   └── index.ts                  # Utility functions:
│                                 #   - formatMinutes(mins) → "1h 30m"
│                                 #   - parseTimeInput("1h 30m") → 90 (minutes)
│                                 #   - formatDateForInput(isoString) → datetime-local format
│                                 #   - cn(...classes) → joined class string
│
└── data/
    ├── tasks.json                # Live task storage file (auto-created)
    └── tasks.backup.json         # Auto-backup created before each write


--------------------------------------------------------------------------------
  TASK DATA STRUCTURE
--------------------------------------------------------------------------------

Each task has the following fields:

  id           string       Unique UUID generated on creation
  title        string       Required, max 200 characters
  description  string?      Optional details
  priority     enum         "critical" | "high" | "medium" | "low"
  status       enum         "pending" | "in-progress" | "completed"
  timeEstimate number       Estimated time in minutes (e.g. 90 = 1h 30m)
  dueDate      string?      ISO 8601 date string (optional)
  createdAt    string       ISO 8601 timestamp, set on creation
  updatedAt    string       ISO 8601 timestamp, updated on every edit
  completedAt  string?      ISO 8601 timestamp, set when marked complete
  tags         string[]?    Optional array of tag labels
  actualTime   number?      Optional actual time spent (minutes)


--------------------------------------------------------------------------------
  PRIORITY SYSTEM
--------------------------------------------------------------------------------

  🔴 Critical  — Must do immediately  (red)
  🟠 High      — Should do today      (orange)
  🟡 Medium    — Should do this week  (yellow)
  🔵 Low       — Can be postponed     (blue)


--------------------------------------------------------------------------------
  API ROUTES
--------------------------------------------------------------------------------

  GET    /api/tasks           — Fetch all tasks
  POST   /api/tasks           — Create a new task (body: TaskFormData)
  GET    /api/tasks/:id       — Fetch a single task by ID
  PUT    /api/tasks/:id       — Update a task (body: Partial<TaskFormData>)
  PATCH  /api/tasks/:id       — Toggle task status (pending ↔ completed)
  DELETE /api/tasks/:id       — Delete a task


--------------------------------------------------------------------------------
  THEME SYSTEM
--------------------------------------------------------------------------------

  - Tailwind CSS v4 custom variant: @custom-variant dark (&:where(.dark, .dark *))
  - ThemeProvider (contexts/ThemeContext.tsx) reads localStorage on mount
  - Applies/removes "dark" class on <html> element
  - Falls back to system preference (prefers-color-scheme) if no stored preference
  - ThemeToggle button shows moon icon (light mode) or sun icon (dark mode)
  - Smooth transitions via CSS: transition: background-color 0.3s ease


--------------------------------------------------------------------------------
  FILTERING & SORTING
--------------------------------------------------------------------------------

  Filters available:
    - Full-text search (title, description, tags)
    - Priority: All | Critical | High | Medium | Low
    - Status:   All | Pending | In Progress | Completed
    - Due Date: All | Overdue | Due Today | Due This Week | No Due Date

  Sort fields:
    - Priority (default)
    - Due Date
    - Created Date
    - Time Estimate
    - Title (alphabetical)

  Sort direction: Ascending or Descending (toggle button)

  Quick filter buttons in sidebar:
    - All Tasks
    - 🔴 Critical
    - 🟠 High Priority
    - ⏳ In Progress
    - ✅ Completed


--------------------------------------------------------------------------------
  DATA PERSISTENCE
--------------------------------------------------------------------------------

  - Tasks are stored in data/tasks.json as a JSON array
  - All writes go through a write queue to prevent race conditions
  - Before each write, the current file is copied to data/tasks.backup.json
  - If tasks.json is corrupted on read, the app falls back to the backup
  - No external database is needed — entirely file-based


--------------------------------------------------------------------------------
  HOW TO RUN
--------------------------------------------------------------------------------

  Install dependencies:
    npm install

  Start development server:
    npm run dev
    → Opens at http://localhost:3000

  Build for production:
    npm run build

  Start production server:
    npm start


--------------------------------------------------------------------------------
  DEPENDENCIES
--------------------------------------------------------------------------------

  Runtime:
    next          16.1.6   — Framework
    react         19.2.3   — UI library
    react-dom     19.2.3   — DOM renderer
    uuid          13.x     — UUID generation for task IDs
    date-fns      4.x      — Date formatting and comparison utilities

  Development:
    typescript            — Type safety
    tailwindcss           — Utility-first CSS framework (v4)
    @tailwindcss/postcss  — PostCSS integration for Tailwind v4
    eslint                — Code linting
    @types/uuid           — TypeScript types for uuid

================================================================================
