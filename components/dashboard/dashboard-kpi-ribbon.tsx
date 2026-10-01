'use client';

import { Building2, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        className={cn(
          'flex flex-col justify-between rounded-lg border p-4 text-left transition-all cursor-pointer',
          activeFilter === 'all'
            ? 'border-[var(--site-cyan)] bg-[var(--site-cyan)]/10 text-foreground shadow-xs'
            : 'border-border bg-card text-card-foreground hover:border-border/80 hover:bg-muted/40',
        )}
      >
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Active Projects
          </span>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-foreground">
            {totalProjects}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">Portfolio</span>
        </div>
        {stageBreakdownText ? (
          <span className="mt-1 font-mono text-[11px] text-muted-foreground truncate">
            {stageBreakdownText}
          </span>
        ) : (
          <span className="mt-1 text-[11px] text-muted-foreground">
            Dubai Jurisdiction
          </span>
        )}
      </button>

      {/* Pending Submittals with Days of Delay */}
      <button
        type="button"
        onClick={() => onSelectFilter?.('delayed')}
        className={cn(
          'flex flex-col justify-between rounded-lg border p-4 text-left transition-all cursor-pointer',
          activeFilter === 'delayed'
            ? 'border-destructive bg-destructive/10 text-foreground shadow-xs'
            : 'border-border bg-card text-card-foreground hover:border-border/80 hover:bg-muted/40',
        )}
      >
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
            Pending Delays
          </span>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-destructive">
            {delayedCount}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">Submittals</span>
        </div>
        <span className="mt-1 text-[11px] text-muted-foreground">
          Avg {avgDelayDays} days delayed past plan
        </span>
      </button>

      {/* 14-Day Expiration Watchlist */}
      <button
        type="button"
        onClick={() => onSelectFilter?.('expiring')}
        className={cn(
          'flex flex-col justify-between rounded-lg border p-4 text-left transition-all cursor-pointer',
          activeFilter === 'expiring'
            ? 'border-amber-500 bg-amber-500/10 text-foreground shadow-xs'
            : 'border-border bg-card text-card-foreground hover:border-border/80 hover:bg-muted/40',
        )}
      >
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            14-Day Expiries
          </span>
          <Clock className="h-4 w-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {expiringCount}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">Urgent</span>
        </div>
        <span className="mt-1 text-[11px] text-muted-foreground">
          Requires renewal before lapse
        </span>
      </button>

      {/* Authority Clearance Rate */}
      <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 text-left text-card-foreground">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Authority Clearance
          </span>
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {clearanceRate}%
          </span>
          <span className="ml-1 text-xs text-muted-foreground">Approved</span>
        </div>
        <span className="mt-1 text-[11px] text-muted-foreground">
          NOC compliance rate
        </span>
      </div>
    </div>
  );
}
