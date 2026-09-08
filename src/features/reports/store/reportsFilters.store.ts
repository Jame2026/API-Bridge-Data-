import { create } from 'zustand';

interface ReportsFiltersState {
  selectedReportId: string | null;
  projectScope: string;
  dateRange: 'today' | '7d' | '30d' | '90d' | 'all';
  searchQuery: string;
  setSelectedReportId: (id: string | null) => void;
  setProjectScope: (scope: string) => void;
  setDateRange: (range: 'today' | '7d' | '30d' | '90d' | 'all') => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useReportsFiltersStore = create<ReportsFiltersState>((set) => ({
  selectedReportId: null,
  projectScope: 'all',
  dateRange: 'all',
  searchQuery: '',
  setSelectedReportId: (id) => set({ selectedReportId: id }),
  setProjectScope: (projectScope) => set({ projectScope }),
  setDateRange: (dateRange) => set({ dateRange }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () =>
    set({
      selectedReportId: null,
      projectScope: 'all',
      dateRange: 'all',
      searchQuery: '',
    }),
}));
