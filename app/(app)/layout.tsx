import Link from 'next/link';
import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: {
    default: 'Engineer Document Collaboration',
    template: '%s | Engineer Document Collaboration',
  },
  description: 'A platform for managing and collaborating on engineering documents',
}

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export default async function AppLayout({ children }: LayoutProps<'/'>) {
  const user = await requireUser();
  const canReview = user.role === 'manager' || user.role === 'doc_controller';
  const isDC = user.role === 'doc_controller';

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/documents" className="font-medium">
            Documents
          </Link>
          <Link href="/noc-tracker" className="font-medium">
            NOC Tracker
          </Link>
          {isDC && <Link href="/users">Users</Link>}
          {isDC && <Link href="/archive">Archive</Link>}
          {canReview && <Link href="/review">Review queue</Link>}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm">{user.full_name || user.email}</span>
          <Badge variant="secondary">{user.role.replace('_', ' ')}</Badge>
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
