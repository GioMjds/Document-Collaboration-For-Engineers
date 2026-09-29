'use client';

import { AlertTriangle, Clock, Ban, Check } from 'lucide-react';
import type { ProjectNocItem } from '@/types/noc';
import { isExpiringSoon } from '@/lib/noc-tracker';

interface NocAlertBannerProps {
  items: ProjectNocItem[];
  activeFilter: string | null;
  onSelectFilter: (filter: string | null) => void;
}

export function NocAlertBanner({
  items,
  activeFilter,
  onSelectFilter,
}: NocAlertBannerProps) {
  const expiringCount = items.filter(
    (i) => isExpiringSoon(i.expiryDate) && i.status !== 'Approved',
  ).length;
  const rejectedCount = items.filter((i) => i.status === 'Rejected').length;
  const pendingPaymentCount = items.filter(
    (i) => i.status === 'Pending for Payment',
  ).length;

  if (expiringCount === 0 && rejectedCount === 0 && pendingPaymentCount === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium border rounded bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800">
        <Check className="h-3.5 w-3.5 text-emerald-600" />
        <span>
          All authority submissions for this project are currently in compliance
          with no immediate deadlines.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs border rounded bg-zinc-50 border-zinc-200 dark:bg-zinc-900/60 dark:border-zinc-800">
      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold uppercase tracking-wider">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <span>Action required</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {expiringCount > 0 && (
          <button
            type="button"
            onClick={() =>
              onSelectFilter(activeFilter === 'expiring' ? null : 'expiring')
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              activeFilter === 'expiring'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{expiringCount} Expiring in 7 Days</span>
          </button>
        )}

        {rejectedCount > 0 && (
          <button
            type="button"
            onClick={() =>
              onSelectFilter(activeFilter === 'rejected' ? null : 'rejected')
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              activeFilter === 'rejected'
                ? 'bg-rose-700 text-white border-rose-700'
                : 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
            }`}
          >
            <Ban className="h-3.5 w-3.5" />
            <span>{rejectedCount} Rejection Resubmittal</span>
          </button>
        )}

        {pendingPaymentCount > 0 && (
          <button
            type="button"
            onClick={() =>
              onSelectFilter(
                activeFilter === 'pending-payment' ? null : 'pending-payment',
              )
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              activeFilter === 'pending-payment'
                ? 'bg-zinc-800 text-white border-zinc-800'
                : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
            }`}
          >
            <span>{pendingPaymentCount} Fee Payment Due</span>
          </button>
        )}

        {activeFilter && (
          <button
            type="button"
            onClick={() => onSelectFilter(null)}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}
