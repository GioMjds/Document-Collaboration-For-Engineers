'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NocMatrixItem } from '@/types/noc';

export interface MatrixItemEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: NocMatrixItem | null;
  masterAuthorityId: number;
  allItems: NocMatrixItem[];
  currentUserRole: string;
  onSaved?: () => void;
}

// Stub drawer placeholder for Task 5 interior implementation.
export function MatrixItemEditorDrawer({
  isOpen,
  onClose,
  item,
}: MatrixItemEditorDrawerProps) {
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
        aria-label={item ? `Edit NOC: ${item.description}` : 'Add Standard NOC'}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-background border-l border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        <header className="p-4 border-b border-border bg-muted/40 shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {item ? `Edit NOC Template #${item.sequenceNo}` : 'Add Standard NOC'}
            </h2>
            <p className="text-xs text-muted-foreground truncate max-w-xs">
              {item ? item.description : 'Create a new statutory template item'}
            </p>
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
            <p className="font-medium text-foreground">Template Editor Drawer Stub</p>
            <p className="mt-1">Full form fields and propagation options are implemented in Task 5.</p>
          </div>
        </div>

        <footer className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </aside>
    </>
  );
}
