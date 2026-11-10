import React from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Timeframe } from '../../types';
import { Calendar } from 'lucide-react';
import { clsx } from 'clsx';

export const TimeframeSelector: React.FC = () => {
  const { timeframe, setTimeframe, theme } = useDashboardStore();
  const isDark = theme === 'dark';

  const options: { label: string; value: Timeframe }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '1 Year', value: '1y' },
  ];

  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          'inline-flex items-center p-1 rounded-xl border backdrop-blur-md',
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
        )}
      >
        <div className="px-2 py-1 flex items-center gap-1.5 text-xs text-slate-400 border-r border-slate-700/50 mr-1">
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Timeframe:</span>
        </div>
        {options.map((option) => {
          const isActive = timeframe === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={clsx(
                'px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
