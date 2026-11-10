import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Table,
  Users,
  Radio,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Category } from '../../types';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { category, setCategory, theme, setSimulatingModalOpen } = useDashboardStore();
  const isDark = theme === 'dark';

  const categories: { label: Category; icon: React.ReactNode }[] = [
    { label: 'All', icon: <Layers className="w-4 h-4" /> },
    { label: 'SaaS', icon: <Zap className="w-4 h-4" /> },
    { label: 'Enterprise', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'E-commerce', icon: <Table className="w-4 h-4" /> },
    { label: 'Mobile', icon: <Activity className="w-4 h-4" /> },
  ];

  const mainNav = [
    { name: 'Live Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, active: true },
    { name: 'Real-Time Stream', icon: <Radio className="w-4 h-4" />, active: false },
    { name: 'Collaborators', icon: <Users className="w-4 h-4" />, active: false },
    { name: 'System Settings', icon: <Settings className="w-4 h-4" />, active: false },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={clsx(
          'fixed md:sticky top-0 z-40 h-screen flex flex-col transition-all duration-300 border-r border-slate-800/80',
          isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-900 text-slate-100',
          collapsed ? 'w-20' : 'w-64',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            {!collapsed && (
              <div className="leading-none">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Pulse<span className="text-indigo-400 font-bold">Analytics</span>
                </span>
                <span className="block text-[10px] uppercase font-mono text-cyan-400 tracking-widest mt-0.5">
                  Real-time v2.4
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Core Navigation */}
          <div>
            {!collapsed && (
              <h4 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Main Views
              </h4>
            )}
            <nav className="space-y-1">
              {mainNav.map((item) => (
                <button
                  key={item.name}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                    item.active
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={item.active ? 'text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                </button>
              ))}
            </nav>
          </div>

          {/* Quick Categories Filter */}
          <div>
            {!collapsed && (
              <h4 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Domain Categories
              </h4>
            )}
            <div className="space-y-1">
              {categories.map((cat) => {
                const isActive = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setCategory(cat.label)}
                    className={clsx(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer',
                      isActive
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    )}
                    title={collapsed ? cat.label : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                        {cat.icon}
                      </span>
                      {!collapsed && <span>{cat.label}</span>}
                    </div>
                    {!collapsed && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="p-3 border-t border-slate-800/80">
          {!collapsed ? (
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Live Sync Active</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mb-2.5">
                Real-time multi-window sync enabled via Web BroadcastChannel & Supabase.
              </p>
              <button
                onClick={() => setSimulatingModalOpen(true)}
                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Simulate Action
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSimulatingModalOpen(true)}
              className="w-full flex justify-center py-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
              title="Simulate action"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
