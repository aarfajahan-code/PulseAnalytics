import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDashboardStore } from '../../store/useDashboardStore';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  glass = true,
  ...props
}) => {
  const theme = useDashboardStore((s) => s.theme);

  const isDark = theme === 'dark';

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl transition-all duration-300 relative overflow-hidden',
          isDark
            ? glass
              ? 'bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 text-slate-100 shadow-xl shadow-black/20'
              : 'bg-slate-900 border border-slate-800 text-slate-100'
            : 'bg-white border border-slate-200 text-slate-900 shadow-lg shadow-slate-200/50',
          hoverEffect &&
            (isDark
              ? 'hover:border-indigo-500/40 hover:shadow-indigo-500/10 hover:shadow-2xl hover:-translate-y-0.5'
              : 'hover:border-indigo-300 hover:shadow-xl hover:-translate-y-0.5'),
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
