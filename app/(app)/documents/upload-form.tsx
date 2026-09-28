'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  documentMetaSchema,
  type DocumentMeta,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  sanitizeFileName,
} from '@/lib/documents';
import { createDocument, docNumberExists } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentMeta>({ resolver: zodResolver(documentMetaSchema) });

  async function onSubmit(values: DocumentMeta) {
    if (!file) {
      toast.error('Please choose a file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large (max 50 MB).');
      return;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error('File type not allowed.');
      return;
    }

    if (await docNumberExists(values.doc_number)) {
      toast.error('Document number already exists.');
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const filePath = `${userId}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;

    // 1) Browser uploads straight to storage (bypasses Vercel body limits)
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { contentType: file.type });

    if (uploadError) {
      setSubmitting(false);
      toast.error(`Upload failed: ${uploadError.message}`);
      return;
    }

    // 2) Server action inserts the metadata row
    const result = await createDocument({
      ...values,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    });

    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success('Document submitted for review.');
    reset();
    setFile(null);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a document</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <Label htmlFor="doc_number">Document number</Label>
            <Input
              id="doc_number"
              placeholder="e.g. DWG-STR-001"
              {...register('doc_number')}
            />
            {errors.doc_number && (
              <p className="text-sm text-destructive">
                {errors.doc_number.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={2} {...register('description')} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept={ALLOWED_MIME_TYPES.join(',')}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Submit for review'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
