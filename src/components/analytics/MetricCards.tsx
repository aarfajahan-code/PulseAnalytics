import React from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { TrendingUp, TrendingDown, Edit2, DollarSign, Users, Activity, Zap, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export const MetricCards: React.FC = () => {
  const { metrics, category, setEditingMetric } = useDashboardStore();

  const filteredMetrics = category === 'All'
    ? metrics
    : metrics.filter((m) => m.category === category);

  const getMetricIcon = (id: string) => {
    switch (id) {
      case 'm-revenue':
        return <DollarSign className="w-5 h-5 text-indigo-400" />;
      case 'm-active-users':
        return <Users className="w-5 h-5 text-cyan-400" />;
      case 'm-conversion-rate':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'm-avg-latency':
        return <Zap className="w-5 h-5 text-amber-400" />;
      default:
        return <Activity className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {filteredMetrics.map((metric) => {
        const isPositive = metric.isPositive;
        return (
          <Card key={metric.id} glass hoverEffect className="p-5 flex flex-col justify-between group">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
                  {getMetricIcon(metric.id)}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {metric.title}
                  </h3>
                  <Badge variant="slate" size="sm" className="mt-0.5 text-[10px]">
                    {metric.category}
                  </Badge>
                </div>
              </div>

              {/* Optimistic Edit Trigger */}
              <button
                onClick={() => setEditingMetric(metric)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white cursor-pointer"
                title="Edit value (Broadcasts live)"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Middle row: Big Metric Value & Trend */}
            <div className="my-4 flex items-baseline justify-between">
              <div>
                <span className="text-2xl lg:text-3xl font-extrabold tracking-tight font-sans">
                  {metric.formattedValue}
                </span>
              </div>

              <div
                className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                  isPositive
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{isPositive ? `+${metric.changePercent}%` : `${metric.changePercent}%`}</span>
              </div>
            </div>

            {/* Bottom Sparkline & Footer metadata */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-slate-500 animate-spin-slow" />
                <span>{metric.lastUpdated}</span>
              </div>

              {/* Sparkline chart */}
              <div className="w-24 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.historicalData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={isPositive ? '#10B981' : '#F43F5E'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
