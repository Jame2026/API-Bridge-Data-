import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface UiState {
  sidebarOpen: boolean;
  activeProjectId: string;
  dateRange: 'today' | '7d' | '30d' | '90d' | 'all';
  toasts: ToastMessage[];
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveProjectId: (id: string) => void;
  setDateRange: (range: 'today' | '7d' | '30d' | '90d' | 'all') => void;
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  activeProjectId: 'all',
  dateRange: 'all',
  toasts: [],
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveProjectId: (activeProjectId) => set({ activeProjectId }),
  setDateRange: (dateRange) => set({ dateRange }),
  addToast: (text, type = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    set((state) => ({ toasts: [...state.toasts, { id, text, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
