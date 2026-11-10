import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'cyan';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'indigo',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 dark:text-indigo-300',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:text-emerald-300',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 dark:text-amber-300',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 dark:text-rose-300',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20 dark:text-slate-300',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 dark:text-cyan-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 rounded-full border transition-colors',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
