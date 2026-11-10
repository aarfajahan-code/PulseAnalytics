import React from 'react';
import { Search, Command, Bell, Layers, Menu } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { ThemeToggle } from './ThemeToggle';
import { RealtimeStatusBadge } from '../collaboration/RealtimeStatusBadge';
import { ActiveCollaborators } from '../collaboration/ActiveCollaborators';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { setCommandPaletteOpen, theme } = useDashboardStore();
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 transition-colors duration-200 border-b backdrop-blur-xl ${
        isDark
          ? 'bg-slate-950/80 border-slate-800/80 text-slate-100'
          : 'bg-white/80 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Left section: Mobile sidebar trigger & Search button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Command Palette search bar button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all duration-200 text-sm group cursor-pointer ${
            isDark
              ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              : 'bg-slate-100/70 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span className="hidden sm:inline-block font-medium">Search metrics, customers, actions...</span>
          <span className="sm:hidden font-medium">Search...</span>
          <kbd className="hidden lg:flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono rounded-md bg-slate-800 border border-slate-700 text-slate-400">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right section: Realtime Status, Active Collaborators, Theme Toggle, Alerts */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Realtime channel indicator */}
        <div className="hidden lg:block">
          <RealtimeStatusBadge />
        </div>

        {/* Active online user avatars */}
        <ActiveCollaborators />

        {/* Theme toggle switch */}
        <ThemeToggle />

        {/* Quick notification bell indicator */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={`relative p-2 rounded-xl border transition-all ${
            isDark
              ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
          }`}
          title="Recent notifications & activity"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
        </button>
      </div>
    </header>
  );
};
