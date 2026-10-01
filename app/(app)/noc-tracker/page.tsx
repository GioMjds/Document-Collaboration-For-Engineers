import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { NocTrackerClient } from '@/components/noc/noc-tracker-client';
import { getNocTrackerData } from '@/lib/server/noc-data';

export const metadata: Metadata = {
  title: 'Authority NOC Tracker',
  description:
    'Authority NOC tracking, sequence dependencies, and expiration management',
};

export default async function NocTrackerPage() {
  const user = await requireUser();
  const { projects, nocs } = await getNocTrackerData();

  return (
    <div className="py-2">
      <NocTrackerClient
        projects={projects}
        initialNocs={nocs}
        currentUserRole={user.role}
      />
    </div>
  );
}
