'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUserRole } from './actions';

import type { Role } from '@/lib/auth';

const LABELS: Record<Role, string> = {
  admin: 'Admin',
  ceo: 'CEO',
  area_manager: 'Area Manager',
  resident_engineer: 'Resident Engineer',
  authority_engineer: 'Authority Engineer',
  dc: 'Document Controller (DC)',
  engineer: 'Engineer',
  doc_controller: 'Document Controller (Legacy)',
  manager: 'Manager (Legacy)',
};

export function RoleSelect({
  userId,
  currentRole,
  isSelf,
}: {
  userId: string;
  currentRole: Role;
  isSelf: boolean;
}) {
  const [value, setValue] = useState<Role>(currentRole);
  const [pending, startTransition] = useTransition();

  function onChange(next: Role) {
    const previous = value;
    setValue(next); // optimistic

    startTransition(async () => {
      const result = await updateUserRole({ user_id: userId, role: next });
      if (!result.ok) {
        setValue(previous); // roll back
        toast.error(result.error);
        return;
      }
      toast.success('Role updated.');
    });
  }

  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as Role)}
      disabled={pending || isSelf}
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(LABELS) as Role[]).map((r) => (
          <SelectItem key={r} value={r}>
            {LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
