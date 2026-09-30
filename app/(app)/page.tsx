import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { ExecutiveDashboardClient } from '@/components/dashboard/executive-dashboard-client';
import {
  SEED_PROJECTS,
  INITIAL_NOCS_PROJECT_23016,
  INITIAL_NOCS_PROJECT_23015,
} from '@/lib/noc-tracker';

export const metadata: Metadata = {
  title: 'Executive Command Deck',
  description:
    'Executive dashboard, discipline transmittal tracking, and authority expiration alerts',
};

export default async function DashboardPage() {
  const user = await requireUser();
  const allInitialNocs = [
    ...INITIAL_NOCS_PROJECT_23016,
    ...INITIAL_NOCS_PROJECT_23015,
  ];

  return (
    <div className="py-2">
      <ExecutiveDashboardClient
        projects={SEED_PROJECTS}
        initialNocs={allInitialNocs}
        currentUserRole={user.role}
      />
    </div>
  );
}
