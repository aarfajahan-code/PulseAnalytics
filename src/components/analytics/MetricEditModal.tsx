import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Edit3, Check, DollarSign } from 'lucide-react';

export const MetricEditModal: React.FC = () => {
  const { editingMetric, setEditingMetric, updateMetric } = useDashboardStore();
  const [newValue, setNewValue] = useState<string>('');

  useEffect(() => {
    if (editingMetric) {
      setNewValue(editingMetric.value.toString());
    }
  }, [editingMetric]);

  if (!editingMetric) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newValue);
    if (!isNaN(parsed)) {
      updateMetric(editingMetric.id, parsed, 'You');
      setEditingMetric(null);
    }
  };

  return (
    <Modal
      isOpen={Boolean(editingMetric)}
      onClose={() => setEditingMetric(null)}
      title={`Update ${editingMetric.title}`}
      subtitle="Changes will optimistically update the UI and sync live across all connected collaborators."
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
            New Numeric Value ({editingMetric.unit})
          </label>
          <div className="relative">
            {editingMetric.prefix && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {editingMetric.prefix}
              </div>
            )}
            <input
              type="number"
              step="any"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className={`w-full rounded-xl border bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-700 ${
                editingMetric.prefix ? 'pl-8' : ''
              }`}
              placeholder="Enter new metric value..."
              autoFocus
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Current Value: <span className="font-mono font-semibold text-slate-200">{editingMetric.formattedValue}</span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditingMetric(null)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save & Broadcast Sync
          </Button>
        </div>
      </form>
    </Modal>
  );
};
