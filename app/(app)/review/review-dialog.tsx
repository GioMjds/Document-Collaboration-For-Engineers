'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { submitReview } from './actions';

export function ReviewDialog({
  documentId,
  docNumber,
  title,
}: {
  documentId: string;
  docNumber: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [pending, setPending] = useState<'approved' | 'rejected' | null>(null);

  async function decide(decision: 'approved' | 'rejected') {
    setPending(decision);
    const result = await submitReview({
      document_id: documentId,
      decision,
      comment,
    });
    setPending(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(
      decision === 'approved' ? 'Document approved.' : 'Document rejected.',
    );
    setComment('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm">Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {docNumber}</DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="comment">Comment (required if rejecting)</Label>
          <Textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            disabled={pending !== null}
            onClick={() => decide('rejected')}
          >
            {pending === 'rejected' ? 'Rejecting...' : 'Reject'}
          </Button>
          <Button
            disabled={pending !== null}
            onClick={() => decide('approved')}
          >
            {pending === 'approved' ? 'Approving...' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
