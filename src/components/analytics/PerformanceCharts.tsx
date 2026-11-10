import React from 'react';
import {
  useAnalyticsSeriesQuery,
  useChannelsQuery,
  useRegionalMetricsQuery,
} from '../../hooks/useDashboardData';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Card } from '../ui/Card';
import { ChartSkeleton } from '../ui/SkeletonLoader';
import { TimeframeSelector } from './TimeframeSelector';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, Globe, PieChart as PieIcon, Cpu } from 'lucide-react';

export const PerformanceCharts: React.FC = () => {
  const { timeframe, theme } = useDashboardStore();
  const isDark = theme === 'dark';

  const { data: seriesData, isLoading: isLoadingSeries } = useAnalyticsSeriesQuery(timeframe);
  const { data: channelData, isLoading: isLoadingChannels } = useChannelsQuery();
  const { data: regionalData, isLoading: isLoadingRegions } = useRegionalMetricsQuery();

  if (isLoadingSeries || isLoadingChannels || isLoadingRegions) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div>
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  // Tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-semibold text-slate-100">
                {entry.name.includes('Revenue') || entry.name.includes('ARR')
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Upper Charts Row: Main Area Chart (2 Cols) & Donut Chart (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Area Chart */}
        <Card glass hoverEffect className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold tracking-tight">Revenue & Active User Growth</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time trend analysis comparing gross revenue ($) and daily active users over time.
              </p>
            </div>
            <TimeframeSelector />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="usersGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 15, fontSize: 12 }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Gross Revenue ($)"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGlow)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Users"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#usersGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Acquisition Donut Chart */}
        <Card glass hoverEffect className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <PieIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold tracking-tight">Acquisition Channels</h3>
            </div>
            <p className="text-xs text-slate-400">Revenue split by traffic channel origin.</p>
          </div>

          <div className="h-48 w-full my-2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold font-mono text-slate-100">$128.4k</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total</span>
            </div>
          </div>

          {/* Breakdown legend list */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {channelData?.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className="text-slate-300 font-medium">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-100 font-semibold">{ch.percentage}%</span>
                  <span className={`text-[10px] ${ch.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {ch.growth >= 0 ? `+${ch.growth}%` : `${ch.growth}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lower Charts Row: Regional Bar Chart & System Latency Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Revenue Bar Chart */}
        <Card glass hoverEffect className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Regional Revenue Distribution</h3>
              <p className="text-xs text-slate-400">Gross revenue & transaction counts per cluster.</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="region" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* System Load & P99 Latency Area Chart */}
        <Card glass hoverEffect className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">System Traffic & P99 Latency</h3>
              <p className="text-xs text-slate-400">API throughput (Millions) vs Response latency (ms).</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}ms`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="latencyMs"
                  name="P99 Latency (ms)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="#F59E0B"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
