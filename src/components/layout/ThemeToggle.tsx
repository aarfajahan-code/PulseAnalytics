import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useDashboardStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative inline-flex items-center justify-center p-2 rounded-xl border border-slate-800 dark:border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
