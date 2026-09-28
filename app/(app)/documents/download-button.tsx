'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDownloadUrl } from './actions';

export function DownloadButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const result = await getDownloadUrl(documentId);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    window.location.href = result.url;
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={loading}>
      <Download className="mr-1 h-4 w-4" />
      {loading ? '...' : 'Download'}
    </Button>
  );
}
