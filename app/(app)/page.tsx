import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { ExecutiveDashboardClient } from '@/components/dashboard/executive-dashboard-client';
import { getNocTrackerData } from '@/lib/server/noc-data';

export const metadata: Metadata = {
  title: 'Executive Command Deck',
  description:
    'Executive dashboard, discipline transmittal tracking, and authority expiration alerts',
};

export default async function DashboardPage() {
  const user = await requireUser();
  const { projects, nocs } = await getNocTrackerData();

  return (
    <div className="py-2">
      <ExecutiveDashboardClient
        projects={projects}
        initialNocs={nocs}
        currentUserRole={user.role}
      />
    </div>
  );
}
