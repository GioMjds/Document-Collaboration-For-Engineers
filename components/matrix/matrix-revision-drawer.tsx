'use client';

import { X, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NocMatrixRevision } from '@/types/noc';

export interface MatrixRevisionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  masterAuthorityId: number;
  revisions: NocMatrixRevision[];
  onRollback?: (revisionId: string) => void;
}

// Stub revision drawer placeholder for Task 5 interior implementation.
export function MatrixRevisionDrawer({
  isOpen,
  onClose,
  revisions,
}: MatrixRevisionDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Revision History & Audit Log"
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] bg-background border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        <header className="p-4 border-b border-border bg-muted/40 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-(--site-cyan)" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Revision History & Audit Log
              </h2>
              <p className="text-xs text-muted-foreground">
                {revisions.length} recorded template {revisions.length === 1 ? 'change' : 'changes'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-muted-foreground">
          <div className="rounded border border-dashed border-border p-4 text-center">
            <p className="font-medium text-foreground">Revision History Drawer Stub</p>
            <p className="mt-1">Detailed audit diffs and rollback controls are implemented in Task 5.</p>
          </div>
        </div>

        <footer className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </footer>
      </aside>
    </>
  );
}
