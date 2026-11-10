import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardStore } from './store/useDashboardStore';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MetricCards } from './components/analytics/MetricCards';
import { PerformanceCharts } from './components/analytics/PerformanceCharts';
import { CategoryFilterBar } from './components/analytics/CategoryFilterBar';
import { EnterpriseDataGrid } from './components/grid/EnterpriseDataGrid';
import { LiveActivityStream } from './components/collaboration/LiveActivityStream';
import { MetricEditModal } from './components/analytics/MetricEditModal';
import { SimulateEventModal } from './components/collaboration/SimulateEventModal';
import { CommandPalette } from './components/command-palette/CommandPalette';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Badge } from './components/ui/Badge';
import { Sparkles, Radio } from 'lucide-react';
import { clsx } from 'clsx';

// Instantiate TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const DashboardMainContent: React.FC = () => {
  const { theme, category } = useDashboardStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isDark = theme === 'dark';

  // Initialize real-time BroadcastChannel & Supabase synchronization
  useRealtimeSync();

  // Apply dark mode class to html element for Tailwind dark styling
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col md:flex-row transition-colors duration-300 font-sans',
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      )}
    >
      {/* Sidebar */}
      <Sidebar
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {/* Dashboard Scrollable Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Welcome & Announcement Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950/60 border border-indigo-500/20 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="cyan" size="sm" className="gap-1 font-mono">
                  <Radio className="w-3 h-3 text-cyan-400 live-pulse" />
                  Real-Time Workspace Active
                </Badge>
                {category !== 'All' && (
                  <Badge variant="indigo" size="sm">
                    Filter: {category}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Real-Time Executive Analytics
              </h1>
              <p className="text-xs md:text-sm text-slate-300">
                Live metrics, cross-tab BroadcastChannel collaboration, optimistic UI updates, and enterprise data grid.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-slate-300">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-400 font-bold">Cmd + K</kbd> for Command Palette
              </div>
            </div>
          </div>

          {/* 1. Live Summary KPI Metric Cards */}
          <MetricCards />

          {/* 2. Debounced Search & Category Filter Bar */}
          <CategoryFilterBar />

          {/* 3. Recharts Performance Analytics Visualization */}
          <PerformanceCharts />

          {/* 4. Enterprise Data Grid & Live Activity Audit Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnterpriseDataGrid />
            </div>
            <div>
              <LiveActivityStream />
            </div>
          </div>
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <MetricEditModal />
      <SimulateEventModal />
      <CommandPalette />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DashboardMainContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
