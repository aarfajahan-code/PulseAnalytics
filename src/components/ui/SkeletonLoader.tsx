import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-xl bg-slate-800/60 dark:bg-slate-800/80',
        className
      )}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-4 w-32" />
        <SkeletonLoader className="h-6 w-12 rounded-full" />
      </div>
      <SkeletonLoader className="h-8 w-24" />
      <div className="flex items-center justify-between pt-2">
        <SkeletonLoader className="h-3 w-28" />
        <SkeletonLoader className="h-3 w-16" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-6 w-48" />
        <SkeletonLoader className="h-8 w-36 rounded-xl" />
      </div>
      <SkeletonLoader className="h-64 w-full rounded-xl" />
    </div>
  );
};
