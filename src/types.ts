export type RoleType = 
  | 'Director of Engineering'
  | 'Director of Software Engineering'
  | 'Senior Engineering Manager'
  | 'Engineering Senior Manager'
  | 'Principal Engineer'
  | 'Principal Software Engineer'
  | 'Software Architect'
  | 'Enterprise Architect'
  | 'Principal Architect'
  | 'Platform Engineering Leader';

export type CompanyType = 'GCC' | 'Fintech' | 'Banking' | 'Startup' | 'Enterprise Product';

export type JobStatus = 'New' | 'Drafted' | 'Applied' | 'Replied' | 'Rejected';

export type ContactType = 'HIRING' | 'HR';

export type ConfidenceLevel = 'VERIFIED' | 'UNVERIFIED' | 'HIGH';

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  experienceYears: number;
  coreSkills: string[];
  databases: string[];
  cloudAndOps: string[];
  domains: string[];
  outcomes: {
    transactionScaling: string;
    latencyReduction: string;
    incidentReduction: string;
    availability: string;
  };
  absentSkills: string[]; // Skills candidate does NOT have (Python, Azure, Golang, etc.)
}

export interface ResumeVariant {
  id: string;
  roleType: string;
  displayName: string;
  fileName: string;
  storagePath: string;
  extractedText: string;
  keywords: string[];
  targetRoles: RoleType[];
}

export interface JobContact {
  id: string;
  jobId: string;
  contactType: ContactType;
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedinUrl: string;
  verificationSource: string;
  verificationNote: string;
  verifiedAt: string;
  confidence: ConfidenceLevel;
}

export interface ATSAnalysis {
  id: string;
  jobId: string;
  resumeId: string;
  resumeName: string;
  totalScore: number;
  roleScore: number;
  leadershipScore: number;
  architectureScore: number;
  domainScore: number;
  cloudDevopsScore: number;
  mandatorySkillPenalty: number;
  matches: string[];
  gaps: string[];
  mandatoryMismatches: string[];
  explanation: string;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  jobUrl: string;
  source: string;
  roleType: RoleType;
  atsScore: number;
  matchedResumeId: string;
  matchedResumeName: string;
  status: JobStatus;
  postedAt: string; // IST ISO string
  discoveredAt: string; // IST ISO string
  lastVerifiedAt: string;
  priorityAction: string;
  deletedAt?: string | null;
  deletionReason?: string | null;
  companyClassification: CompanyType;
  stabilitySignal: string;
  growthSignal: string;
  contacts: JobContact[];
  atsAnalysis?: ATSAnalysis;
  gmailDraftId?: string;
  gmailDraftLink?: string;
  gmailDraftCreatedAt?: string;
}

export interface ApplicationLog {
  id: string;
  jobId: string;
  jobTitle?: string;
  company?: string;
  eventType: 'JOB_DISCOVERED' | 'ATS_ANALYZED' | 'CONTACT_VERIFIED' | 'GMAIL_DRAFTED' | 'STATUS_CHANGED' | 'SOFT_DELETED' | 'RESTORED' | 'WHATSAPP_NOTIFIED';
  notes: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface OutreachDraft {
  id: string;
  jobId: string;
  gmailDraftId: string;
  recipients: string[];
  subject: string;
  bodyText: string;
  resumeFile: string;
  createdAt: string;
  gmailDraftLink: string;
}

export interface AgentRun {
  id: string;
  agentName: 'Scout' | 'ATS Analyst' | 'Contact Research' | 'Outreach Specialist' | 'Notification Specialist' | 'Full Pipeline';
  status: 'Running' | 'Completed' | 'Failed';
  jobsFound: number;
  jobsAdded: number;
  draftsCreated: number;
  contactsVerified: number;
  summary: string;
  sourcesChecked: string[];
  startedAt: string;
  completedAt: string;
}

export interface FilterState {
  searchQuery: string;
  location: string; // 'all' | 'Bengaluru' | 'India Remote' | 'Global Remote'
  roleType: string;
  companyType: string;
  status: string;
  minAtsScore: number;
  showDeleted: boolean;
  resumeType: string;
  hasVerifiedContacts: string; // 'all' | 'yes' | 'no'
}

export interface SortState {
  column: 'atsScore' | 'company' | 'title' | 'postedAt' | 'discoveredAt' | 'status' | 'matchedResumeName';
  direction: 'asc' | 'desc';
}
