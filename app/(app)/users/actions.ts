'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type UserRoles =
  | 'admin'
  | 'dc'
  | 'authority_engineer'
  | 'engineer'
  | 'resident_engineer'
  | 'area_manager'
  | 'ceo'
  | 'doc_controller'
  | 'manager';

const roleSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum([
    'admin',
    'dc',
    'authority_engineer',
    'engineer',
    'resident_engineer',
    'area_manager',
    'ceo',
    'doc_controller',
    'manager',
  ]),
});

export async function updateUserRole(input: {
  user_id: string;
  role: UserRoles;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireRole(['admin', 'dc', 'doc_controller']);

  const parsed = roleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid input.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role: parsed.data.role })
    .eq('id', parsed.data.user_id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/users');
  return { ok: true };
}

export async function inviteUser(input: {
  email: string;
  full_name: string;
  role: UserRoles;
}) {
  await requireRole(['admin', 'dc', 'doc_controller']);
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.inviteUserByEmail(
    input.email,
    {
      data: { full_name: input.full_name },
    },
  );
  if (error || !data.user)
    return { ok: false as const, error: error?.message ?? 'Invite failed.' };

  // The signup trigger created the profile as 'engineer'; set the chosen role
  await admin
    .from('profiles')
    .update({ role: input.role })
    .eq('id', data.user.id);

  revalidatePath('/users');
  return { ok: true as const };
}
