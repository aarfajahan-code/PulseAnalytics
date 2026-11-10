import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useDashboardStore } from '../../store/useDashboardStore';
import {
  Search,
  Zap,
  Moon,
  Sun,
  Filter,
  Download,
  Sparkles,
  Layers,
  BarChart3,
  Calendar,
  X,
  FileSpreadsheet,
  FileJson,
} from 'lucide-react';
import { Category, Timeframe } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    theme,
    toggleTheme,
    setCategory,
    setTimeframe,
    setSimulatingModalOpen,
    metrics,
    setEditingMetric,
    resetFilters,
  } = useDashboardStore();

  const isDark = theme === 'dark';

  // Cmd/Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* CmdK Dialog Container */}
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-10 text-slate-100 animate-in zoom-in-95 duration-150">
        <Command className="w-full">
          {/* Input field */}
          <div className="flex items-center px-4 border-b border-slate-800">
            <Search className="w-4 h-4 text-indigo-400 mr-3 flex-shrink-0" />
            <Command.Input
              placeholder="Type a command, metric, filter, or action..."
              className="w-full py-4 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List options */}
          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-2">
            <Command.Empty className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching commands found.
            </Command.Empty>

            {/* Group: Metric Actions */}
            <Command.Group heading="Optimistic Metric Actions" className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">
              {metrics.map((m) => (
                <Command.Item
                  key={m.id}
                  onSelect={() => {
                    setEditingMetric(m);
                    setCommandPaletteOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span>Edit {m.title}</span>
                  </div>
                  <span className="font-mono text-slate-400 font-semibold">{m.formattedValue}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group: Filter Controls */}
            <Command.Group heading="Category Filters" className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">
              {(['All', 'SaaS', 'Enterprise', 'E-commerce', 'Mobile'] as Category[]).map((cat) => (
                <Command.Item
                  key={cat}
                  onSelect={() => {
                    setCategory(cat);
                    setCommandPaletteOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <span>Filter by {cat} Category</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group: Timeframe Toggles */}
            <Command.Group heading="Timeframe Analytics" className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">
              {(
                [
                  { label: 'Last 7 Days', val: '7d' },
                  { label: 'Last 30 Days', val: '30d' },
                  { label: 'Last 1 Year', val: '1y' },
                ] as { label: string; val: Timeframe }[]
              ).map((tf) => (
                <Command.Item
                  key={tf.val}
                  onSelect={() => {
                    setTimeframe(tf.val);
                    setCommandPaletteOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Set Timeframe to {tf.label}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Group: System Controls */}
            <Command.Group heading="System & UX Controls" className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">
              <Command.Item
                onSelect={() => {
                  toggleTheme();
                  setCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>Toggle Theme Mode ({isDark ? 'Light' : 'Dark'})</span>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  setSimulatingModalOpen(true);
                  setCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Simulate Real-time Collaborator Event</span>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  resetFilters();
                  setCommandPaletteOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <Layers className="w-4 h-4 text-rose-400" />
                <span>Reset All Active Filters</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer keyboard hint */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            <span>Use ↑ ↓ to navigate</span>
            <span>ESC to exit</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
