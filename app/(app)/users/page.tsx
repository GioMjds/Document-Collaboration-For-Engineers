import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { RoleSelect } from './role-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function UsersPage() {
  const me = await requireRole(['doc_controller']);
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Users</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                {u.full_name || '-'}
                {u.id === me.id && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (you)
                  </span>
                )}
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <RoleSelect
                  userId={u.id}
                  currentRole={u.role}
                  isSelf={u.id === me.id}
                />
              </TableCell>
              <TableCell>
                {new Date(u.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
