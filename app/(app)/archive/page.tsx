import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { RestoreButton } from './restore-button';
import { DownloadButton } from '../documents/download-button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function ArchivePage() {
  await requireRole(['doc_controller']);
  const supabase = await createClient();

  const { data: docs } = await supabase
    .from('documents')
    .select(
      'id, doc_number, title, status_before_archive, archived_at, archiver:profiles!documents_archived_by_fkey(full_name)',
    )
    .eq('status', 'archived')
    .order('archived_at', { ascending: false });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Archive</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doc #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Was</TableHead>
            <TableHead>Archived by</TableHead>
            <TableHead>Archived on</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs?.length ? (
            docs.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-sm">
                  {d.doc_number}
                </TableCell>
                <TableCell>{d.title}</TableCell>
                <TableCell className="capitalize">
                  {d.status_before_archive ?? '-'}
                </TableCell>
                <TableCell>{d.archiver?.full_name || '-'}</TableCell>
                <TableCell>
                  {d.archived_at
                    ? new Date(d.archived_at).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <DownloadButton documentId={d.id} />
                  <RestoreButton documentId={d.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                Nothing archived.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
