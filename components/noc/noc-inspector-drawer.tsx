'use client';

import { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  AlertCircle,
  Upload,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NocStatusBadge } from './noc-status-badge';
import type { ProjectNocItem, NocStatus } from '@/types/noc';
import { calculateDaysRemaining } from '@/lib/noc-tracker';
import { toast } from 'sonner';

interface NocInspectorDrawerProps {
  item: ProjectNocItem | null;
  allNocs: ProjectNocItem[];
  isOpen: boolean;
  currentUserRole?: string;
  onClose: () => void;
  onUpdateNoc: (updated: ProjectNocItem) => void;
}

export function NocInspectorDrawer({
  item,
  allNocs,
  isOpen,
  currentUserRole = 'engineer',
  onClose,
  onUpdateNoc,
}: NocInspectorDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [isEditingRef, setIsEditingRef] = useState(false);
  const [refInput, setRefInput] = useState('');
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitFileName, setResubmitFileName] = useState('');

  if (!isOpen || !item) return null;

  const daysRemaining = calculateDaysRemaining(item.expiryDate);

  const prerequisite = item.blockingSequenceNumber
    ? allNocs.find(
        (n) =>
          n.projectCode === item.projectCode &&
          n.sequenceNumber === item.blockingSequenceNumber,
      )
    : null;

  const isPrerequisiteMet = !prerequisite || prerequisite.status === 'Approved';

  function copyRef() {
    if (!item) return;
    navigator.clipboard.writeText(item.referenceNumber);
    setCopied(true);
    toast.success('Authority reference number copied.');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveRef() {
    if (!item) return;
    if (!refInput.trim()) {
      toast.error('Reference number cannot be empty.');
      return;
    }
    if (currentUserRole === 'engineer') {
      toast.error('Only Document Controllers and Managers can update authority reference numbers.');
      return;
    }
    onUpdateNoc({
      ...item,
      referenceNumber: refInput.trim(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditingRef(false);
    toast.success('Authority reference number updated.');
  }

  function handleTogglePaid() {
    if (!item) return;
    if (currentUserRole === 'engineer') {
      toast.error('Only Document Controllers and Managers can record fee payments.');
      return;
    }
    const nextPaid = !item.isPaid;
    onUpdateNoc({
      ...item,
      isPaid: nextPaid,
      status:
        nextPaid && item.status === 'Pending for Payment'
          ? 'Not Started'
          : item.status,
      updatedAt: new Date().toISOString(),
    });
    toast.success(nextPaid ? 'Marked fee as Paid.' : 'Marked fee as Unpaid.');
  }

  function handleToggleRequirement(reqId: string) {
    if (!item) return;
    const nextRequirements = item.requirements.map((r) =>
      r.id === reqId ? { ...r, isSatisfied: !r.isSatisfied } : r,
    );
    onUpdateNoc({
      ...item,
      requirements: nextRequirements,
      updatedAt: new Date().toISOString(),
    });
  }

  function handleStatusChange(newStatus: NocStatus) {
    if (!item) return;
    if (newStatus === 'Approved' && currentUserRole === 'engineer') {
      toast.error('Authority approvals require Resident Engineer, Area Manager, or Admin authority.');
      return;
    }
    if (newStatus === 'Approved' && !isPrerequisiteMet) {
      toast.error(
        'Cannot mark Approved: prerequisite blocking sequence is not satisfied.',
      );
      return;
    }
    onUpdateNoc({
      ...item,
      status: newStatus,
      issuanceDate:
        newStatus === 'Approved' && !item.issuanceDate
          ? new Date().toISOString().split('T')[0]
          : item.issuanceDate,
      updatedAt: new Date().toISOString(),
    });
    toast.success(`NOC status updated to ${newStatus}.`);
  }

  function handleResubmit() {
    if (!item) return;
    if (!resubmitFileName.trim()) {
      toast.error(
        'Please specify the revised drawing or submittal document name.',
      );
      return;
    }
    const currentRevNum = parseInt(item.revision.replace('R', ''), 10) || 0;
    const nextRev = `R${String(currentRevNum + 1).padStart(2, '0')}`;

    onUpdateNoc({
      ...item,
      status: 'Not Started',
      applyDate: new Date().toISOString().split('T')[0],
      revision: nextRev,
      rejectionReason: undefined,
      requirements: item.requirements.map((r) => ({ ...r, isSatisfied: true })),
      updatedAt: new Date().toISOString(),
    });
    setResubmitting(false);
    setResubmitFileName('');
    toast.success(`Submittal dispatched as revision ${nextRev}.`);
  }

  return (
    <aside
      aria-label="NOC Details Inspector"
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-105 bg-background border-l border-border shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
    >
      {/* Drawer Header */}
      <div className="flex items-start justify-between p-4 border-b bg-muted/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              Seq #{item.sequenceNumber} · {item.stage}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-muted">
              Rev {item.revision}
            </span>
          </div>
          <h2 className="text-base font-semibold leading-tight">
            {item.reviewingAuthority}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspector drawer"
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
        {/* Status & Quick Change */}
        <section className="p-3 border rounded bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Current status
            </span>
            <NocStatusBadge
              status={item.status}
              isBlocked={!isPrerequisiteMet}
              blockerTitle={
                prerequisite
                  ? `${prerequisite.reviewingAuthority} #${prerequisite.sequenceNumber}`
                  : undefined
              }
            />
          </div>

          <div className="pt-2 flex flex-wrap gap-1.5">
            {(
              [
                'Approved',
                'Pending for Payment',
                'Rejected',
                'Not Started',
              ] as NocStatus[]
            ).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStatusChange(st)}
                disabled={item.status === st}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  item.status === st
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-background hover:bg-muted text-foreground'
                }`}
              >
                Mark {st}
              </button>
            ))}
          </div>

          {item.status === 'Rejected' && item.rejectionReason && (
            <div className="mt-2 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900">
              <span className="font-semibold block mb-0.5">
                Authority Rejection Feedback:
              </span>
              <p>{item.rejectionReason}</p>
            </div>
          )}
        </section>

        {/* Authority Reference */}
        <section className="p-3 border rounded bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Authority reference #
            </span>
            {!isEditingRef && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={copyRef}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Copy reference number"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRefInput(item.referenceNumber);
                    setIsEditingRef(true);
                  }}
                  className="text-xs text-primary hover:underline ml-1"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {isEditingRef ? (
            <div className="space-y-2">
              <Input
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="e.g. DEWA-2023-9981"
                className="font-mono text-xs h-8"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleSaveRef}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setIsEditingRef(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="font-mono text-sm font-semibold tracking-wide bg-muted/60 p-2 rounded border">
              {item.referenceNumber || 'Pending Issuance'}
            </div>
          )}

          <div className="text-xs text-muted-foreground flex justify-between pt-1">
            <span>
              Submitted by: <strong>{item.submittedBy}</strong>
            </span>
            <span>
              Project: <strong>{item.projectCode}</strong>
            </span>
          </div>
        </section>

        {/* Blocking Prerequisite Sequence */}
        {item.blockingSequenceNumber && (
          <section className="p-3 border rounded bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Blocking sequence dependency
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isPrerequisiteMet
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {isPrerequisiteMet ? 'Prerequisite Met' : 'Blocked'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {item.blockingSequenceDescription ||
                `Requires Sequence #${item.blockingSequenceNumber} approval`}
            </p>
            {prerequisite && (
              <div className="text-xs p-2 rounded bg-muted/40 border flex items-center justify-between">
                <span>
                  Seq #{prerequisite.sequenceNumber}:{' '}
                  {prerequisite.reviewingAuthority} ({prerequisite.description})
                </span>
                <NocStatusBadge status={prerequisite.status} />
              </div>
            )}
          </section>
        )}

        {/* Interconnected Requirements Checklist */}
        <section className="p-3 border rounded bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Interconnected requirements
            </span>
            <span className="text-xs text-muted-foreground">
              {item.requirements.filter((r) => r.isSatisfied).length}/
              {item.requirements.length} satisfied
            </span>
          </div>

          <ul className="space-y-1.5 pt-1">
            {item.requirements.map((req) => (
              <li
                key={req.id}
                className="flex items-start gap-2 p-1.5 rounded hover:bg-muted/50 text-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => handleToggleRequirement(req.id)}
                  className="mt-0.5 text-muted-foreground hover:text-foreground"
                >
                  {req.isSatisfied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-zinc-400" />
                  )}
                </button>
                <div className="flex-1">
                  <span
                    className={
                      req.isSatisfied
                        ? 'line-through text-muted-foreground'
                        : 'font-medium'
                    }
                  >
                    {req.title}
                  </span>
                  {req.fileName && (
                    <span className="block font-mono text-[11px] text-muted-foreground mt-0.5">
                      Attached: {req.fileName}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Payment Fee Tracking */}
        <section className="p-3 border rounded bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase font-semibold">
              Authority payment fee
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                item.isPaid
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {item.isPaid ? 'Paid' : 'Pending Payment'}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-lg font-bold font-mono">
              AED {item.paymentFee.toLocaleString()}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={handleTogglePaid}
            >
              {item.isPaid ? 'Mark as Unpaid' : 'Record Payment'}
            </Button>
          </div>
        </section>

        {/* Dates & Expiry */}
        <section className="p-3 border rounded bg-card space-y-2 text-xs">
          <span className="text-xs text-muted-foreground uppercase font-semibold block">
            Key timeline dates
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-muted-foreground block">Plan Date:</span>
              <span className="font-mono font-medium">{item.planDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Apply Date:</span>
              <span className="font-mono font-medium">
                {item.applyDate || 'Not Applied'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">
                Issuance Date:
              </span>
              <span className="font-mono font-medium">
                {item.issuanceDate || 'Pending'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Expiry Date:</span>
              <span className="font-mono font-medium">
                {item.expiryDate || 'N/A'}
              </span>
            </div>
          </div>

          {daysRemaining !== null && (
            <div
              className={`mt-2 p-2 rounded text-xs flex items-center gap-1.5 ${
                daysRemaining < 0
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                  : daysRemaining <= 7
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {daysRemaining < 0
                  ? `Permit expired ${Math.abs(daysRemaining)} days ago. Resubmission for revalidation required.`
                  : daysRemaining <= 7
                    ? `Warning: Expiration in ${daysRemaining} days. Notification dispatched.`
                    : `${daysRemaining} days remaining on current NOC validity.`}
              </span>
            </div>
          )}
        </section>

        {/* Resubmission Section (Active if Rejected or Expired) */}
        {(item.status === 'Rejected' || item.status === 'Expired') && (
          <section className="p-3 border rounded bg-zinc-900 text-white space-y-3 dark:bg-zinc-950 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Upload className="h-4 w-4" />
                <span>
                  {item.status === 'Rejected'
                    ? 'Resubmit Rejected Drawings'
                    : 'Resubmit for Revalidation'}
                </span>
              </h3>
              <p className="text-xs text-zinc-300 mt-1">
                Submitting updates the revision tag from {item.revision} to R
                {String(
                  (parseInt(item.revision.replace('R', ''), 10) || 0) + 1,
                ).padStart(2, '0')}
                .
              </p>
            </div>

            {resubmitting ? (
              <div className="space-y-3 pt-1">
                <div>
                  <Label
                    htmlFor="resubmit_file"
                    className="text-xs text-zinc-200"
                  >
                    Revised CAD / PDF Drawing Package
                  </Label>
                  <Input
                    id="resubmit_file"
                    value={resubmitFileName}
                    onChange={(e) => setResubmitFileName(e.target.value)}
                    placeholder="e.g. DWG-23016-DCD-R01.pdf"
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-8 mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-white text-zinc-900 hover:bg-zinc-100 h-8 text-xs font-semibold"
                    onClick={handleResubmit}
                  >
                    Confirm & Dispatch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 h-8 text-xs"
                    onClick={() => setResubmitting(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-semibold"
                onClick={() => setResubmitting(true)}
              >
                Initiate Resubmission
              </Button>
            )}
          </section>
        )}
      </div>
    </aside>
  );
}
