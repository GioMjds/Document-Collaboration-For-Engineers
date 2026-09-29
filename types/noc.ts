export type MasterAuthority =
  | 'Nakheel and Trakhees'
  | 'Dubai Municipality'
  | 'Dubai Development Authority';

export type ReviewingAuthority =
  | 'Trakhees'
  | 'Nakheel'
  | 'DEWA'
  | 'Empower'
  | 'RTA'
  | 'EHS'
  | 'DCAA'
  | 'DM'
  | 'DU'
  | 'Etisalat'
  | 'Green Building'
  | 'Third Party'
  | 'DCD'
  | 'DDA';

export type NocStage =
  | 'Design NOC'
  | 'Construction NOC'
  | 'Information NOC'
  | 'Handover NOC';

export type NocStatus =
  | 'Approved'
  | 'Rejected'
  | 'Not Started'
  | 'Pending for Payment'
  | 'Not Needed'
  | 'Expired';

export type SubmittedBy =
  | 'Consultant'
  | 'Client'
  | 'Contractor'
  | 'Specialists';

export interface NocRequirement {
  id: string;
  title: string;
  isSatisfied: boolean;
  notes?: string;
  fileName?: string;
}

export interface ProjectNocItem {
  id: string;
  projectCode: string;
  sequenceNumber: number;
  stage: NocStage;
  reviewingAuthority: ReviewingAuthority;
  description: string;
  submittedBy: SubmittedBy;
  referenceNumber: string;
  status: NocStatus;
  paymentFee: number;
  isPaid: boolean;
  planDate: string;
  applyDate: string | null;
  issuanceDate: string | null;
  expiryDate: string | null;
  blockingSequenceNumber: number | null;
  blockingSequenceDescription?: string;
  requirements: NocRequirement[];
  rejectionReason?: string;
  revision: string;
  updatedAt: string;
}

export interface AssignedProject {
  code: string;
  name: string;
  masterAuthority: MasterAuthority;
  projectType: string;
  location: string;
  contractType: string;
  currentStage: string;
  assignedRoles: {
    authorityEngineer: string;
    architectEngineer: string;
    mepEngineer: string;
    structureEngineer: string;
    civilEngineer: string;
    residentEngineer: string;
    areaManager: string;
    docController: string;
  };
}
