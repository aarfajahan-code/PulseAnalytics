import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MetricItem,
  UserPresence,
  ActivityEvent,
  Category,
  Timeframe,
  TransactionStatus,
  ThemeMode,
} from '../types';
import { INITIAL_METRICS, INITIAL_COLLABORATORS, INITIAL_ACTIVITY_LOG } from '../lib/mockData';
import { realtimeHub } from '../lib/supabase';

interface DashboardState {
  // Theme & UX
  theme: ThemeMode;
  commandPaletteOpen: boolean;
  editingMetric: MetricItem | null;
  simulatingModalOpen: boolean;
  
  // Analytics Filters
  timeframe: Timeframe;
  category: Category;
  searchQuery: string;
  statusFilter: TransactionStatus | 'All';

  // Real-Time Data
  metrics: MetricItem[];
  collaborators: UserPresence[];
  activityLogs: ActivityEvent[];

  // Enterprise Grid Column Visibility
  columnVisibility: Record<string, boolean>;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setEditingMetric: (metric: MetricItem | null) => void;
  setSimulatingModalOpen: (open: boolean) => void;
  
  setTimeframe: (timeframe: Timeframe, broadcast?: boolean) => void;
  setCategory: (category: Category, broadcast?: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: TransactionStatus | 'All') => void;

  updateMetric: (metricId: string, newValue: number, updatedBy?: string) => void;
  addActivityEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  addCollaborator: (user: UserPresence) => void;
  removeCollaborator: (id: string) => void;
  toggleColumnVisibility: (columnId: string) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // Default state
      theme: 'dark',
      commandPaletteOpen: false,
      editingMetric: null,
      simulatingModalOpen: false,

      timeframe: '7d',
      category: 'All',
      searchQuery: '',
      statusFilter: 'All',

      metrics: INITIAL_METRICS,
      collaborators: INITIAL_COLLABORATORS,
      activityLogs: INITIAL_ACTIVITY_LOG,

      columnVisibility: {
        transactionId: true,
        customerName: true,
        category: true,
        amount: true,
        status: true,
        region: true,
        latency: true,
        plan: true,
        timestamp: true,
        actions: true,
      },

      // Actions
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setEditingMetric: (metric) => set({ editingMetric: metric }),
      setSimulatingModalOpen: (open) => set({ simulatingModalOpen: open }),

      setTimeframe: (timeframe, broadcast = true) => {
        set({ timeframe });
        if (broadcast) {
          realtimeHub.broadcast('FILTER_CHANGED', { timeframe });
          get().addActivityEvent({
            userId: 'current-user',
            userName: 'You',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            action: 'changed timeframe to',
            target: timeframe,
            type: 'filter_change',
          });
        }
      },

      setCategory: (category, broadcast = true) => {
        set({ category });
        if (broadcast) {
          realtimeHub.broadcast('FILTER_CHANGED', { category });
          get().addActivityEvent({
            userId: 'current-user',
            userName: 'You',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            action: 'filtered category by',
            target: category,
            type: 'filter_change',
          });
        }
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),

      updateMetric: (metricId, newValue, updatedBy = 'You') => {
        const metrics = get().metrics;
        const target = metrics.find((m) => m.id === metricId);
        if (!target) return;

        const oldValue = target.value;
        const changePercent = Number((((newValue - oldValue) / (oldValue || 1)) * 100).toFixed(1));
        const formattedValue = target.prefix
          ? `${target.prefix}${newValue.toLocaleString()}`
          : target.suffix
          ? `${newValue.toLocaleString()}${target.suffix}`
          : newValue.toLocaleString();

        const updatedMetric: MetricItem = {
          ...target,
          value: newValue,
          formattedValue,
          changePercent: changePercent !== 0 ? changePercent : target.changePercent,
          isPositive: changePercent >= 0,
          lastUpdated: 'Just now',
          updatedBy,
          historicalData: [
            ...target.historicalData.slice(1),
            { date: 'Now', value: newValue },
          ],
        };

        const newMetrics = metrics.map((m) => (m.id === metricId ? updatedMetric : m));
        set({ metrics: newMetrics });

        // Broadcast realtime update
        realtimeHub.broadcast('METRIC_UPDATED', { metricId, newValue, updatedMetric }, updatedBy);

        // Log activity
        get().addActivityEvent({
          userId: 'current-user',
          userName: updatedBy,
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          action: 'updated metric',
          target: `${target.title} → ${formattedValue}`,
          type: 'metric_update',
        });
      },

      addActivityEvent: (eventData) => {
        const newEvent: ActivityEvent = {
          ...eventData,
          id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: 'Just now',
        };
        set((state) => ({
          activityLogs: [newEvent, ...state.activityLogs.slice(0, 49)],
        }));
      },

      addCollaborator: (user) => {
        set((state) => {
          if (state.collaborators.some((c) => c.id === user.id)) return state;
          return { collaborators: [...state.collaborators, user] };
        });
      },

      removeCollaborator: (id) => {
        set((state) => ({
          collaborators: state.collaborators.filter((c) => c.id !== id),
        }));
      },

      toggleColumnVisibility: (columnId) => {
        set((state) => ({
          columnVisibility: {
            ...state.columnVisibility,
            [columnId]: !state.columnVisibility[columnId],
          },
        }));
      },

      resetFilters: () => {
        set({
          searchQuery: '',
          category: 'All',
          statusFilter: 'All',
          timeframe: '7d',
        });
      },
    }),
    {
      name: 'pulse-dashboard-storage',
      partialize: (state) => ({
        theme: state.theme,
        timeframe: state.timeframe,
        columnVisibility: state.columnVisibility,
      }),
    }
  )
);
