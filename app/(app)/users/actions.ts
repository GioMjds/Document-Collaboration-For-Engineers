'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

type UserRoles = 'engineer' | 'manager' | 'doc_controller';

const roleSchema = z.object({
  user_id: z.uuid(),
  role: z.enum(['engineer', 'manager', 'doc_controller']),
});

export async function updateUserRole(input: {
  user_id: string;
  role: UserRoles;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireRole(['doc_controller']);

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
  role: 'engineer' | 'manager' | 'doc_controller';
}) {
  await requireRole(['doc_controller']);
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
