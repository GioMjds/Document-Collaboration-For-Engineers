'use client';

import { Building2, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

interface DashboardKpiRibbonProps {
  totalProjects: number;
  delayedCount: number;
  avgDelayDays: number;
  expiringCount: number;
  clearanceRate: number;
  activeFilter?: 'all' | 'delayed' | 'expiring';
  onSelectFilter?: (filter: 'all' | 'delayed' | 'expiring') => void;
  stageDistribution?: Record<string, number>;
}

export function DashboardKpiRibbon({
  totalProjects,
  delayedCount,
  avgDelayDays,
  expiringCount,
  clearanceRate,
  activeFilter = 'all',
  onSelectFilter,
  stageDistribution,
}: DashboardKpiRibbonProps) {
  const stageBreakdownText = stageDistribution
    ? Object.entries(stageDistribution)
        .filter(([, count]) => count > 0)
        .map(([stage, count]) => `${count} ${stage}`)
        .join(' · ')
    : null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {/* Total Active Projects */}
      <button
        type="button"
        onClick={() => onSelectFilter?.('all')}
        className={`flex flex-col justify-between rounded-lg border p-4 text-left transition ${
          activeFilter === 'all'
            ? 'border-blue-500 bg-blue-50/40 dark:border-blue-700 dark:bg-blue-950/30'
            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Active Projects
          </span>
          <Building2 className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalProjects}
          </span>
          <span className="ml-1 text-xs text-slate-500">Portfolio</span>
        </div>
        {stageBreakdownText ? (
          <span className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {stageBreakdownText}
          </span>
        ) : (
          <span className="mt-1 text-[11px] text-slate-400">
            Dubai Jurisdiction
          </span>
        )}
      </button>

      {/* Pending Submittals with Days of Delay */}
      <button
        type="button"
        onClick={() => onSelectFilter?.('delayed')}
        className={`flex flex-col justify-between rounded-lg border p-4 text-left transition ${
          activeFilter === 'delayed'
            ? 'border-rose-500 bg-rose-50/40 dark:border-rose-700 dark:bg-rose-950/30'
            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Pending Delays
          </span>
          <AlertTriangle className="h-4 w-4 text-rose-500" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            {delayedCount}
          </span>
          <span className="ml-1 text-xs text-slate-500">Submittals</span>
        </div>
        <span className="mt-1 text-[11px] text-slate-400">
          Avg {avgDelayDays} days delayed past plan
        </span>
      </button>

      {/* 14-Day Expiration Watchlist */}
      <button
        type="button"
        onClick={() => onSelectFilter?.('expiring')}
        className={`flex flex-col justify-between rounded-lg border p-4 text-left transition ${
          activeFilter === 'expiring'
            ? 'border-amber-500 bg-amber-50/40 dark:border-amber-700 dark:bg-amber-950/30'
            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            14-Day Expiries
          </span>
          <Clock className="h-4 w-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {expiringCount}
          </span>
          <span className="ml-1 text-xs text-slate-500">Urgent</span>
        </div>
        <span className="mt-1 text-[11px] text-slate-400">
          Requires renewal before lapse
        </span>
      </button>

      {/* Authority Clearance Rate */}
      <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Authority Clearance
          </span>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {clearanceRate}%
          </span>
          <span className="ml-1 text-xs text-slate-500">Approved</span>
        </div>
        <span className="mt-1 text-[11px] text-slate-400">
          NOC compliance rate
        </span>
      </div>
    </div>
  );
}
