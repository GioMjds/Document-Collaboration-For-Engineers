import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { UploadForm } from './upload-form';
import { DownloadButton } from './download-button';
import { ArchiveButton } from './archive-button';
import { StatusBadge } from '@/components/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatSize } from '@/utils/formatters';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Manage and track engineering documents',
}

export default async function DocumentsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const isDC = user.role === 'doc_controller';

  // RLS filters this automatically per role
  const { data: documents } = await supabase
    .from('documents')
    .select(
      'id, doc_number, title, status, file_size, created_at, uploaded_by, reviews(decision, comment, created_at)',
    )
    .neq('status', 'archived')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <UploadForm userId={user.id} />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Documents</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doc #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.length ? (
              documents.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-sm">
                    {d.doc_number}
                  </TableCell>
                  <TableCell>{d.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={d.status} />
                    {d.status === 'rejected' && d.reviews?.length > 0 && (
                      <div className="mt-1 text-xs text-red-700">
                        Reason:{' '}
                        {
                          [...d.reviews].sort((a, b) =>
                            b.created_at.localeCompare(a.created_at),
                          )[0].comment
                        }
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatSize(d.file_size)}</TableCell>
                  <TableCell>
                    {new Date(d.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DownloadButton documentId={d.id} />
                    {isDC && (
                      <ArchiveButton
                        documentId={d.id}
                        docNumber={d.doc_number}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No documents yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
