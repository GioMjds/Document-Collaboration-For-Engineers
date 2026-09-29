import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { NocTrackerClient } from '@/components/noc/noc-tracker-client';
import {
  SEED_PROJECTS,
  INITIAL_NOCS_PROJECT_23016,
  INITIAL_NOCS_PROJECT_23015,
} from '@/lib/noc-tracker';

export const metadata: Metadata = {
  title: 'Authority NOC Tracker',
  description:
    'Authority NOC tracking, sequence dependencies, and expiration management',
};

export default async function NocTrackerPage() {
  const user = await requireUser();
  const allInitialNocs = [
    ...INITIAL_NOCS_PROJECT_23016,
    ...INITIAL_NOCS_PROJECT_23015,
  ];

  return (
    <div className="py-2">
      <NocTrackerClient
        projects={SEED_PROJECTS}
        initialNocs={allInitialNocs}
        currentUserRole={user.role}
      />
    </div>
  );
}
