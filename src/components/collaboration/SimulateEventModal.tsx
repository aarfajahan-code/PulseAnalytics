import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { Sparkles, UserPlus, Zap, Filter, Radio } from 'lucide-react';

export const SimulateEventModal: React.FC = () => {
  const { simulatingModalOpen, setSimulatingModalOpen, addCollaborator, updateMetric, setCategory } =
    useDashboardStore();
  const { triggerSimulatedCollaboratorAction } = useRealtimeSync();

  if (!simulatingModalOpen) return null;

  const handleSimulateJoin = () => {
    const mockNames = ['Jordan Lee', 'Aria Montgomery', 'Liam Vance', 'Chloe Bennett'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    addCollaborator({
      id: `u-${Date.now()}`,
      name: randomName,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=100&auto=format&fit=crop&q=80`,
      role: 'Analyst',
      status: 'online',
      activeSection: 'Analytics Overview',
      lastActive: 'Just now',
      color: '#06B6D4',
    });
    triggerSimulatedCollaboratorAction('joined collaboration session', 'Dashboard', randomName);
    setSimulatingModalOpen(false);
  };

  const handleSimulateMetricUpdate = () => {
    updateMetric('m-revenue', 134200, 'Marcus Vance (Simulated)');
    setSimulatingModalOpen(false);
  };

  const handleSimulateFilterChange = () => {
    setCategory('Enterprise', true);
    setSimulatingModalOpen(false);
  };

  return (
    <Modal
      isOpen={simulatingModalOpen}
      onClose={() => setSimulatingModalOpen(false)}
      title="Simulate Real-Time Collaborator Action"
      subtitle="Broadcast mock actions to test live UI sync across browser tabs & active streams."
    >
      <div className="space-y-3">
        <button
          onClick={handleSimulateMetricUpdate}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                Simulate Revenue Metric Increase
              </p>
              <p className="text-[11px] text-slate-400">Update Revenue to $134,200 & broadcast live</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
        </button>

        <button
          onClick={handleSimulateJoin}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                Simulate Collaborator Join
              </p>
              <p className="text-[11px] text-slate-400">Add a new collaborator avatar to presence bar</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
        </button>

        <button
          onClick={handleSimulateFilterChange}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                Simulate Category Filter Switch
              </p>
              <p className="text-[11px] text-slate-400">Switch global filter to 'Enterprise' category</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
        </button>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800 mt-4">
        <Button variant="outline" size="sm" onClick={() => setSimulatingModalOpen(false)}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
