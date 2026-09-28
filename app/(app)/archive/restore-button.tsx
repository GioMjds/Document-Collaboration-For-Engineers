'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { restoreDocument } from '../documents/actions';

export function RestoreButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const result = await restoreDocument(documentId);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Document restored.');
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={loading}>
      <Undo2 className="mr-1 h-4 w-4" />
      {loading ? '...' : 'Restore'}
    </Button>
  );
}
