import React from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Activity, Clock, Filter, Download, Zap, UserPlus, Sparkles } from 'lucide-react';
import { ActivityEvent } from '../../types';

export const LiveActivityStream: React.FC = () => {
  const { activityLogs } = useDashboardStore();

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'metric_update':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'filter_change':
        return <Filter className="w-3.5 h-3.5 text-indigo-400" />;
      case 'export':
        return <Download className="w-3.5 h-3.5 text-emerald-400" />;
      case 'presence_join':
        return <UserPlus className="w-3.5 h-3.5 text-cyan-400" />;
      case 'system_alert':
        return <Sparkles className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <Card glass className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">Live Activity Stream</h3>
            <p className="text-xs text-slate-400">Real-time audit log of collaborator interactions.</p>
          </div>
        </div>
        <Badge variant="emerald" size="sm" className="gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse" />
          Live Audit Feed
        </Badge>
      </div>

      {/* Feed List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {activityLogs.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <img
              src={item.userAvatar}
              alt={item.userName}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-200 truncate">
                  {item.userName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {item.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-300">
                <span className="p-1 rounded-md bg-slate-800">{getEventIcon(item.type)}</span>
                <span className="text-slate-400">{item.action}</span>
                <span className="font-semibold text-slate-100 font-mono truncate">{item.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
