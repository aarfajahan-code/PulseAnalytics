import React from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Wifi, Radio } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const RealtimeStatusBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      {isSupabaseConfigured ? (
        <Badge variant="emerald" size="sm" className="gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse" />
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span>Supabase Live</span>
        </Badge>
      ) : (
        <Badge variant="cyan" size="sm" className="gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 live-pulse" />
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>BroadcastChannel Sync</span>
        </Badge>
      )}
    </div>
  );
};
