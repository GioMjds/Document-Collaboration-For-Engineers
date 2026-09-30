'use client';

import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardKpiRibbon } from './dashboard-kpi-ribbon';
import { ProjectDisciplineCard } from './project-discipline-card';
import { SubmittalDelayTable } from './submittal-delay-table';
import type {
  AssignedProject,
  ProjectNocItem,
  ProjectDisciplineStatus,
  DisciplineStageStatus,
  ThirdPartySpecialistType,
} from '@/types/noc';
import {
  INITIAL_PROJECT_DISCIPLINE_STATUS,
  calculateSubmittalDelays,
} from '@/lib/project-status';
import { isExpiringSoon } from '@/lib/noc-tracker';
import {
  Layers,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface ExecutiveDashboardClientProps {
  projects: AssignedProject[];
  initialNocs: ProjectNocItem[];
  currentUserRole: string;
}

const AVAILABLE_ROLES = [
  { value: 'admin', label: 'Admin (Full Access)' },
  { value: 'ceo', label: 'CEO (Read Only Portfolio)' },
  { value: 'area_manager', label: 'Area Manager (Executive Review)' },
  { value: 'architect_engineer', label: 'Architect Engineer (Engr. Abram)' },
  { value: 'structure_engineer', label: 'Structure Engineer (Engr. Khalid)' },
  { value: 'mep_engineer', label: 'MEP Engineer (Engr. Hisham)' },
  { value: 'authority_engineer', label: 'Authority Engineer (Engr. Rasha)' },
  { value: 'resident_engineer', label: 'Resident Engineer (Engr. Abdel)' },
  { value: 'dc', label: 'Document Controller (Ms. Jalilah)' },
  { value: 'doc_controller', label: 'Document Controller (Legacy doc_controller)' },
];

export function ExecutiveDashboardClient({
  projects,
  initialNocs,
  currentUserRole,
}: ExecutiveDashboardClientProps) {
  const [currentRole, setCurrentRole] = useState<string>(currentUserRole || 'admin');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'disciplines' | 'delays'>('disciplines');
  const [kpiFilter, setKpiFilter] = useState<'all' | 'delayed' | 'expiring'>('all');

  const [disciplineStatuses, setDisciplineStatuses] = useState<
    Record<string, ProjectDisciplineStatus>
  >(INITIAL_PROJECT_DISCIPLINE_STATUS);

  const [nocItems] = useState<ProjectNocItem[]>(initialNocs);

  const isExecutiveRole = useMemo(() => {
    const r = currentRole.toLowerCase();
    return r === 'admin' || r === 'ceo' || r === 'area_manager' || r === 'manager';
  }, [currentRole]);

  const visibleProjects = useMemo(() => {
    if (isExecutiveRole) {
      return projects;
    }
    // Discipline engineers and DC see assigned projects
    return projects.filter((p) => {
      const assigned = Object.values(p.assignedRoles);
      return (
        assigned.some((name) =>
          currentRole.includes('architect') && name.includes('Abram') || name.includes('Adel')
        ) ||
        currentRole.includes('structure') ||
        currentRole.includes('mep') ||
        currentRole.includes('authority') ||
        currentRole.includes('resident') ||
        currentRole === 'dc' ||
        currentRole.includes('doc_controller') ||
        currentRole.includes('engineer')
      );
    });
  }, [projects, isExecutiveRole, currentRole]);

  const filteredProjects = useMemo(() => {
    if (selectedProjectFilter === 'all') {
      return visibleProjects;
    }
    return visibleProjects.filter((p) => p.code === selectedProjectFilter);
  }, [visibleProjects, selectedProjectFilter]);

  const filteredNocs = useMemo(() => {
    const visibleCodes = new Set(visibleProjects.map((p) => p.code));
    return nocItems.filter((n) => visibleCodes.has(n.projectCode));
  }, [nocItems, visibleProjects]);

  const delayItems = useMemo(() => {
    return calculateSubmittalDelays(filteredNocs, projects);
  }, [filteredNocs, projects]);

  const expiringNocs = useMemo(() => {
    return filteredNocs.filter(
      (n) => isExpiringSoon(n.expiryDate) && n.status === 'Approved',
    );
  }, [filteredNocs]);

  const totalDelays = delayItems.length;
  const avgDelayDays = useMemo(() => {
    if (totalDelays === 0) return 0;
    const sum = delayItems.reduce((acc, d) => acc + d.daysDelayed, 0);
    return Math.round(sum / totalDelays);
  }, [delayItems, totalDelays]);

  const clearanceRate = useMemo(() => {
    if (filteredNocs.length === 0) return 0;
    const approved = filteredNocs.filter((n) => n.status === 'Approved').length;
    return Math.round((approved / filteredNocs.length) * 100);
  }, [filteredNocs]);

  const handleUpdateDiscipline = (
    projectCode: string,
    discipline: 'architecture' | 'structure' | 'mep',
    newStatus: DisciplineStageStatus,
    remarks?: string,
  ) => {
    setDisciplineStatuses((prev) => {
      const current = prev[projectCode];
      if (!current) return prev;
      return {
        ...prev,
        [projectCode]: {
          ...current,
          [discipline]: {
            ...current[discipline],
            status: newStatus,
            remarks: remarks !== undefined ? remarks : current[discipline].remarks,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const handleUpdateAuthorityStage = (
    projectCode: string,
    stageKey: 'designStage' | 'constructionStage' | 'revisionStage',
    newStatus: DisciplineStageStatus,
  ) => {
    setDisciplineStatuses((prev) => {
      const current = prev[projectCode];
      if (!current) return prev;
      return {
        ...prev,
        [projectCode]: {
          ...current,
          authorities: {
            ...current.authorities,
            [stageKey]: newStatus,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const handleUploadSpecialistFile = (
    projectCode: string,
    type: ThirdPartySpecialistType,
    fileName: string,
    fileSize: string,
  ) => {
    setDisciplineStatuses((prev) => {
      const current = prev[projectCode];
      if (!current) return prev;
      const updatedSpecialists = current.specialists.map((s) => {
        if (s.type === type) {
          return {
            ...s,
            fileName,
            fileSize,
            uploadedBy: 'You',
            uploadedAt: new Date().toISOString(),
            status: 'Uploaded' as const,
          };
        }
        return s;
      });
      return {
        ...prev,
        [projectCode]: {
          ...current,
          specialists: updatedSpecialists,
        },
      };
    });
  };

  const handleApproveSpecialistFile = (
    projectCode: string,
    type: ThirdPartySpecialistType,
  ) => {
    setDisciplineStatuses((prev) => {
      const current = prev[projectCode];
      if (!current) return prev;
      const updatedSpecialists = current.specialists.map((s) => {
        if (s.type === type) {
          return {
            ...s,
            status: 'Approved' as const,
          };
        }
        return s;
      });
      return {
        ...prev,
        [projectCode]: {
          ...current,
          specialists: updatedSpecialists,
        },
      };
    });
  };

  const handleKpiSelect = (filter: 'all' | 'delayed' | 'expiring') => {
    setKpiFilter(filter);
    if (filter === 'delayed' || filter === 'expiring') {
      setActiveTab('delays');
    } else {
      setActiveTab('disciplines');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Command Header & Role Simulation Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Executive Command Deck
            </h1>
            <Badge variant="secondary" className="text-xs">
              Live Demo
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Portfolio oversight, discipline transmittal statuses, submittal delays, and 14-day expiry alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Scoping Filter */}
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-slate-400" />
            <Select
              value={selectedProjectFilter}
              onValueChange={(val) => {
                if (val) setSelectedProjectFilter(val);
              }}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visible Projects ({visibleProjects.length})</SelectItem>
                {visibleProjects.map((p) => (
                  <SelectItem key={p.code} value={p.code}>
                    #{p.code} - {p.name.substring(0, 18)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interactive Role Switcher for Testing */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-800 dark:bg-slate-800">
            <UserCheck className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] font-medium text-slate-500">Role Preview:</span>
            <Select
              value={currentRole}
              onValueChange={(val) => {
                if (val) setCurrentRole(val);
              }}
            >
              <SelectTrigger className="w-[190px] h-7 border-0 bg-transparent text-xs font-semibold focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <DashboardKpiRibbon
        totalProjects={visibleProjects.length}
        delayedCount={totalDelays}
        avgDelayDays={avgDelayDays}
        expiringCount={expiringNocs.length}
        clearanceRate={clearanceRate}
        activeFilter={kpiFilter}
        onSelectFilter={handleKpiSelect}
      />

      {/* View Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('disciplines');
              setKpiFilter('all');
            }}
            className={`flex items-center gap-2 border-b-2 pb-2.5 text-sm font-semibold transition ${
              activeTab === 'disciplines'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            Discipline & Specialist Status
            <Badge variant="outline" className="text-xs font-mono ml-1">
              {filteredProjects.length} Projects
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('delays')}
            className={`flex items-center gap-2 border-b-2 pb-2.5 text-sm font-semibold transition ${
              activeTab === 'delays'
                ? 'border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            Pending Delays & Expiries
            {(totalDelays > 0 || expiringNocs.length > 0) && (
              <Badge className="bg-rose-500 text-white text-xs font-mono ml-1">
                {totalDelays + expiringNocs.length} Urgent
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Discipline & Specialist Status Grid (Section 5) */}
      {activeTab === 'disciplines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredProjects.map((project) => {
              const statusRecord = disciplineStatuses[project.code] || {
                projectCode: project.code,
                architecture: {
                  status: 'Not Started',
                  updatedBy: 'Unassigned',
                  updatedAt: new Date().toISOString(),
                },
                structure: {
                  status: 'Not Started',
                  updatedBy: 'Unassigned',
                  updatedAt: new Date().toISOString(),
                },
                mep: {
                  status: 'Not Started',
                  updatedBy: 'Unassigned',
                  updatedAt: new Date().toISOString(),
                },
                authorities: {
                  designStage: 'Not Started',
                  constructionStage: 'Not Started',
                  revisionStage: 'Not Started',
                  updatedBy: 'Unassigned',
                  updatedAt: new Date().toISOString(),
                },
                specialists: [],
              };

              return (
                <ProjectDisciplineCard
                  key={project.code}
                  project={project}
                  statusRecord={statusRecord}
                  userRole={currentRole}
                  onUpdateDiscipline={handleUpdateDiscipline}
                  onUpdateAuthorityStage={handleUpdateAuthorityStage}
                  onUploadSpecialistFile={handleUploadSpecialistFile}
                  onApproveSpecialistFile={handleApproveSpecialistFile}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Pending Delays & Expiry Watchlist (Section 6) */}
      {activeTab === 'delays' && (
        <SubmittalDelayTable
          delayItems={delayItems}
          expiringNocs={expiringNocs}
        />
      )}
    </div>
  );
}
