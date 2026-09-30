import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: {
    default: 'Engineer Document Collaboration',
    template: '%s | Engineer Document Collaboration',
  },
  description:
    'A platform for managing and collaborating on engineering documents',
};

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export default async function AppLayout({ children }: LayoutProps<'/'>) {
  const user = await requireUser();
  const canReview = [
    'manager',
    'resident_engineer',
    'area_manager',
    'doc_controller',
    'dc',
    'admin',
  ].includes(user.role);
  const canManageUsers = ['admin', 'dc', 'doc_controller'].includes(user.role);
  const canArchive = ['dc', 'doc_controller', 'admin'].includes(user.role);

  const roleLabelMap = {
    admin: 'Admin',
    ceo: 'CEO',
    area_manager: 'Area Manager',
    resident_engineer: 'Resident Engineer',
    authority_engineer: 'Authority Engineer',
    dc: 'Document Controller',
    doc_controller: 'Document Controller',
    engineer: 'Engineer',
    manager: 'Manager',
  } satisfies Record<string, string>;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="font-semibold text-slate-900 dark:text-slate-100"
          >
            Dashboard
          </Link>
          <Link href="/noc-tracker" className="font-medium">
            NOC Tracker
          </Link>
          <Link href="/documents" className="font-medium">
            Documents
          </Link>
          {canManageUsers && <Link href="/users">Users</Link>}
          {canArchive && <Link href="/archive">Archive</Link>}
          {canReview && <Link href="/review">Review queue</Link>}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm">{user.full_name || user.email}</span>
          <Badge variant="secondary">
            {roleLabelMap[user.role] ?? user.role.replace('_', ' ')}
          </Badge>
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
