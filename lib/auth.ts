import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type Role =
  | 'admin'
  | 'dc'
  | 'authority_engineer'
  | 'engineer'
  | 'resident_engineer'
  | 'area_manager'
  | 'ceo'
  | 'doc_controller'
  | 'manager';

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile) {
    return { ...profile, email: user.email ?? '' };
  }

  return {
    id: user.id,
    full_name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'Engineer',
    role: ((user.user_metadata?.role as Role) || 'engineer') as Role,
    email: user.email ?? '',
  };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(allowed: Role[]) {
  const user = await requireUser();
  if (!allowed.includes(user.role)) redirect('/documents');
  return user;
}
