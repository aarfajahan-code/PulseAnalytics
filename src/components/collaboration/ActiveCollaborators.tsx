import React from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { UserPlus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const ActiveCollaborators: React.FC = () => {
  const { collaborators, setSimulatingModalOpen } = useDashboardStore();

  const maxVisible = 4;
  const visibleUsers = collaborators.slice(0, maxVisible);
  const extraCount = Math.max(0, collaborators.length - maxVisible);

  return (
    <div className="flex items-center gap-3">
      {/* Avatars group */}
      <div className="flex items-center -space-x-2.5 overflow-hidden">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="relative group transition-transform duration-200 hover:scale-110 hover:z-20 cursor-pointer"
            title={`${user.name} (${user.role}) - ${user.activeSection || user.status}`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-slate-900 object-cover ring-2 ring-slate-800"
            />
            {/* Status dot */}
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                user.status === 'editing'
                  ? 'bg-amber-400 animate-ping'
                  : user.status === 'online'
                  ? 'bg-emerald-400'
                  : 'bg-slate-500'
              }`}
            />

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
              <div className="bg-slate-900 border border-slate-700 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-[10px] text-indigo-400">{user.role}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {user.status === 'editing' ? `Editing: ${user.activeSection}` : `Active: ${user.activeSection}`}
                </p>
              </div>
              <div className="w-2 h-2 bg-slate-900 border-b border-r border-slate-700 rotate-45 -mt-1" />
            </div>
          </div>
        ))}

        {extraCount > 0 && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 text-xs font-semibold text-slate-300">
            +{extraCount}
          </div>
        )}
      </div>

      {/* Simulate action trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSimulatingModalOpen(true)}
        leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
        className="hidden sm:inline-flex text-xs border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
      >
        Simulate Live Event
      </Button>
    </div>
  );
};
