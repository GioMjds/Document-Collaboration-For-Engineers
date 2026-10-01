import { Badge } from '@/components/ui/badge';

const styles = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-slate-200 text-slate-600',
} satisfies Record<string, string>;

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase() as keyof typeof styles;
  const styleClass = styles[key] || styles.draft;
  return (
    <Badge
      variant="outline"
      className={`border-transparent capitalize ${styleClass}`}
    >
      {status}
    </Badge>
  );
}
