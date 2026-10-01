import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { NocMatrixWorkspace } from '@/components/matrix/noc-matrix-workspace';
import { getMatrixTemplates, getMatrixRevisions } from './actions';

export const metadata: Metadata = {
  title: 'Authority NOC Matrix Templates | CVTEC EDMS',
  description:
    'Standard statutory approval frameworks, sequential prerequisites, and baseline templates across Dubai authorities.',
};

export default async function NocMatrixPage() {
  const user = await requireUser();

  const [templatesRes, revisionsRes] = await Promise.all([
    getMatrixTemplates(1),
    getMatrixRevisions(1),
  ]);

  return (
    <div className="py-2">
      <NocMatrixWorkspace
        initialAuthorityId={1}
        initialItems={templatesRes.ok ? templatesRes.data : []}
        initialRevisions={revisionsRes.ok ? revisionsRes.data : []}
        currentUserRole={user.role}
      />
    </div>
  );
}
