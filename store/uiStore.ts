import { create } from 'zustand';
import { Task, FilterState, SortState, Status, ViewType } from '@/types';

const DEFAULT_FILTER: FilterState = {
  priority: 'all',
  status: 'all',
  search: '',
  dueDateFilter: 'all',
};

const DEFAULT_SORT: SortState = {
  field: 'priority',
  direction: 'asc',
};

interface UIStore {
  // Layout
  view: ViewType;
  sidebarOpen: boolean;

  // Modal
  selectedTask: Task | null;
  isCreating: boolean;
  defaultStatus: Status;

  // Command palette
  cmdOpen: boolean;

  // Filter & sort
  filter: FilterState;
  sort: SortState;

  // Actions
  setView: (v: ViewType) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  openNew: (status?: Status) => void;
  openEdit: (task: Task) => void;
  closeModal: () => void;

  openCmd: () => void;
  closeCmd: () => void;

  setFilter: (partial: Partial<FilterState>) => void;
  resetFilter: () => void;
  setSort: (s: SortState) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  view: 'kanban',
  sidebarOpen: true,

  selectedTask: null,
  isCreating: false,
  defaultStatus: 'pending',

  cmdOpen: false,

  filter: DEFAULT_FILTER,
  sort: DEFAULT_SORT,

  setView: (v) => set({ view: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openNew: (status = 'pending') =>
    set({ selectedTask: null, defaultStatus: status, isCreating: true }),
  openEdit: (task) => set({ selectedTask: task, isCreating: false }),
  closeModal: () => set({ selectedTask: null, isCreating: false }),

  openCmd: () => set({ cmdOpen: true }),
  closeCmd: () => set({ cmdOpen: false }),

  setFilter: (partial) =>
    set((s) => ({ filter: { ...s.filter, ...partial } })),
  resetFilter: () => set({ filter: DEFAULT_FILTER }),
  setSort: (s) => set({ sort: s }),
}));
