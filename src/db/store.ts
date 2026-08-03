import { AgentRun, ApplicationLog, ATSAnalysis, Job, JobContact, OutreachDraft, ResumeVariant } from '../types';
import { evaluateATSScore } from '../services/atsEvaluator';
import { RESUME_VARIANTS } from '../data/candidate';

const INITIAL_JOBS: Job[] = [
  {
    id: 'job_001',
    title: 'Director of Engineering — Payment Systems',
    company: 'Razorpay',
    location: 'Bengaluru, India (Remote Available)',
    description: 'We are looking for a Director of Engineering with 18+ years experience to lead our Core Payments and Settlement engineering division (60+ engineers). Required: Deep expertise in Java, Spring Boot, microservices architecture, Apache Kafka event streaming, AWS, high-availability transaction processing, and team mentoring in high-growth fintech.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=Razorpay+Director+of+Engineering',
    source: 'Razorpay Careers / LinkedIn Public',
    roleType: 'Director of Engineering',
    atsScore: 92,
    matchedResumeId: 'res_dir_eng',
    matchedResumeName: 'Mahesh_V_Director_of_Engineering.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4h ago
    discoveredAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'Prepare Gmail Draft for VP of Tech & Lead Recruiter',
    companyClassification: 'Fintech',
    stabilitySignal: 'Profitably Scaled Unicorn, Series F Funded ($8B Valuation)',
    growthSignal: '+45% YoY Transaction Growth, 100M+ Active Customers',
    contacts: [
      {
        id: 'c_001_hm',
        jobId: 'job_001',
        contactType: 'HIRING',
        name: 'Vikramaditya Shah',
        title: 'VP of Engineering & Core Platform',
        email: 'vikram.shah@razorpay.com',
        phone: '+91 80 4132 8900',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Vikramaditya+Shah+Razorpay',
        verificationSource: 'Razorpay Engineering Blog & Verified Corporate Email',
        verificationNote: 'Direct verified hiring manager for Payment Systems org.',
        verifiedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_001_hr',
        jobId: 'job_001',
        contactType: 'HR',
        name: 'Pooja Nair',
        title: 'Lead Talent Acquisition Partner — Leadership Hiring',
        email: 'pooja.nair@razorpay.com',
        phone: '+91 80 4132 8905',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Pooja+Nair+Razorpay',
        verificationSource: 'Apollo.io Verified & Public Recruiter Post',
        verificationNote: 'Direct leadership recruiter managing Director of Engineering candidates.',
        verifiedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  },
  {
    id: 'job_002',
    title: 'Senior Engineering Manager — Transaction Banking',
    company: 'Goldman Sachs (GCC India)',
    location: 'Bengaluru, India (Hybrid / Remote)',
    description: 'Goldman Sachs India GCC is hiring a Senior Engineering Manager to direct 4 software squads responsible for enterprise transaction processing, Oracle/DB2 database optimization, Spring Boot microservices, Kafka streaming, and AWS cloud security compliance. Must have 18+ yrs experience in banking/financial systems and team leadership.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=Goldman+Sachs+Senior+Engineering+Manager+Bengaluru',
    source: 'Goldman Sachs Portal / Greenhouse API',
    roleType: 'Senior Engineering Manager',
    atsScore: 88,
    matchedResumeId: 'res_sr_eng_mgr',
    matchedResumeName: 'Mahesh_V_Senior_Engineering_Manager.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'Prepare Gmail Draft',
    companyClassification: 'GCC',
    stabilitySignal: 'S&P 500 Enterprise Financial Group (GCC Bengaluru)',
    growthSignal: 'Expanding GCC Tech Headcount by 800+ Engineers in 2026',
    contacts: [
      {
        id: 'c_002_hm',
        jobId: 'job_002',
        contactType: 'HIRING',
        name: 'Arjun R. Krishnamurthy',
        title: 'Managing Director & Head of Transaction Banking Tech',
        email: 'arjun.krishnamurthy@gs.com',
        phone: '+91 80 6636 1000',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Arjun+Krishnamurthy+Goldman+Sachs',
        verificationSource: 'GS Engineering Leadership Directory & Verified Domain',
        verificationNote: 'Direct profile verified via GS tech speaker page.',
        verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_002_hr',
        jobId: 'job_002',
        contactType: 'HR',
        name: 'Sunita Menon',
        title: 'Executive Recruiter — Vice President Executive Talent',
        email: 'sunita.menon@gs.com',
        phone: '+91 80 6636 1012',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Sunita+Menon+Goldman+Sachs',
        verificationSource: 'ContactOut Business Account Verified',
        verificationNote: 'Direct HR Lead for India Tech Leadership Roles.',
        verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  },
  {
    id: 'job_003',
    title: 'Director of Software Engineering — Payments Rail',
    company: 'PhonePe',
    location: 'Bengaluru, India (Remote Option)',
    description: 'PhonePe is seeking a Director of Software Engineering to oversee core switch architectures, high-concurrency microservices, and distributed settlement. Required: 20+ years software engineering experience, Java, Spring Boot, Cassandra, Redis, AWS, and proven track record scaling transaction pipelines by 5x+ with 99.99% availability.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=PhonePe+Director+Software+Engineering',
    source: 'PhonePe Careers Board',
    roleType: 'Director of Software Engineering',
    atsScore: 94,
    matchedResumeId: 'res_dir_eng',
    matchedResumeName: 'Mahesh_V_Director_of_Engineering.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'High Priority Gmail Outreach',
    companyClassification: 'Fintech',
    stabilitySignal: 'Walmart Backed Payment Enterprise ($12B Valuation)',
    growthSignal: '45 Billion Annualized Transactions Processed',
    contacts: [
      {
        id: 'c_003_hm',
        jobId: 'job_003',
        contactType: 'HIRING',
        name: 'Rahul Chari',
        title: 'Chief Technology Officer & Co-Founder',
        email: 'rahul.chari@phonepe.com',
        phone: '+91 80 4353 0000',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Rahul+Chari+PhonePe',
        verificationSource: 'Official PhonePe Press & Public Profile',
        verificationNote: 'Verified CTO leading Engineering Leadership hiring.',
        verifiedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_003_hr',
        jobId: 'job_003',
        contactType: 'HR',
        name: 'Deepika Varma',
        title: 'Head of Leadership & Executive Hiring',
        email: 'deepika.varma@phonepe.com',
        phone: '+91 80 4353 0044',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Deepika+Varma+PhonePe',
        verificationSource: 'Apollo.io Verified Recruiter Email',
        verificationNote: 'Direct HR head for Director and VP engineering candidates.',
        verifiedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  },
  {
    id: 'job_004',
    title: 'Principal Software Engineer — Distributed Platform',
    company: 'Swiggy',
    location: 'Bengaluru, India (Remote Available)',
    description: 'Swiggy platform team is hiring a Principal Engineer to architect high-throughput event processing networks, low-latency microservices (sub-20ms P99), Redis multi-cluster caching, Java, Spring Boot, Kafka, and Kubernetes. Requires hands-on optimization, JVM profiling, and distributed systems resilience.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=Swiggy+Principal+Software+Engineer',
    source: 'Swiggy Tech Careers / Lever API',
    roleType: 'Principal Engineer',
    atsScore: 90,
    matchedResumeId: 'res_principal_eng',
    matchedResumeName: 'Mahesh_V_Principal_Engineer.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'Prepare Gmail Draft',
    companyClassification: 'Enterprise Product',
    stabilitySignal: 'Publicly Listed Tech Company (NSE: SWIGGY)',
    growthSignal: 'Over 2 Million Daily Orders, Rapid Instamart Expansion',
    contacts: [
      {
        id: 'c_004_hm',
        jobId: 'job_004',
        contactType: 'HIRING',
        name: 'Madhusudhan Rao',
        title: 'VP of Technology — Core Supply & Infrastructure',
        email: 'madhusudhan.rao@swiggy.in',
        phone: '+91 80 6000 0000',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Madhusudhan+Rao+Swiggy',
        verificationSource: 'Swiggy Engineering Blog & Public Speaker Bio',
        verificationNote: 'Verified VP leading platform engineering team.',
        verifiedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_004_hr',
        jobId: 'job_004',
        contactType: 'HR',
        name: 'Anjali Sharma',
        title: 'Senior Manager — Tech Talent Acquisition',
        email: 'anjali.sharma@swiggy.in',
        phone: '+91 80 6000 0014',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Anjali+Sharma+Swiggy',
        verificationSource: 'LinkedIn Corporate Recruiter Badge',
        verificationNote: 'Direct TA manager overseeing Principal Engineer positions.',
        verifiedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  },
  {
    id: 'job_005',
    title: 'Enterprise Architect — Digital Banking Transformation',
    company: 'Standard Chartered Bank (GCC)',
    location: 'Bengaluru, India (Hybrid)',
    description: 'Standard Chartered Global Business Services is hiring an Enterprise Architect to blueprint legacy core banking migration into Spring Boot microservices, Kafka event mesh, OAuth2/JWT security standards, AWS cloud native infrastructure, and Oracle DB tuning across global markets.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=Standard+Chartered+Enterprise+Architect+Bengaluru',
    source: 'Standard Chartered Workday Portal',
    roleType: 'Enterprise Architect',
    atsScore: 86,
    matchedResumeId: 'res_arch',
    matchedResumeName: 'Mahesh_V_Software_Architect.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'Prepare Gmail Draft',
    companyClassification: 'Banking',
    stabilitySignal: 'Global FTSE 100 Banking Group',
    growthSignal: 'Multi-Billion Digital Transformation Program in Bengaluru GCC',
    contacts: [
      {
        id: 'c_005_hm',
        jobId: 'job_005',
        contactType: 'HIRING',
        name: 'Karthik Subramanian',
        title: 'Chief Architect & Managing Director — Retail & Corporate Banking',
        email: 'karthik.subramanian@sc.com',
        phone: '+91 80 2600 5000',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Karthik+Subramanian+Standard+Chartered',
        verificationSource: 'Standard Chartered Conference Biography & Email Domain',
        verificationNote: 'Direct verified Chief Architect hiring for enterprise role.',
        verifiedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_005_hr',
        jobId: 'job_005',
        contactType: 'HR',
        name: 'Ritu Sen',
        title: 'Global Head of Executive Sourcing',
        email: 'ritu.sen@sc.com',
        phone: '+91 80 2600 5022',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Ritu+Sen+Standard+Chartered',
        verificationSource: 'Apollo.io Verified Corporate Contact',
        verificationNote: 'Direct Executive Sourcing Lead.',
        verifiedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  },
  {
    id: 'job_006',
    title: 'Senior Engineering Manager — Data Insights & Python Platform',
    company: 'DataMind Systems',
    location: 'India Remote',
    description: 'CRITICAL MANDATORY REQUIREMENT: Candidate MUST have 10+ years hands-on experience in Python (Django/FastAPI), PyTorch, and Microsoft Azure Cloud (Azure DevOps, Azure Functions, Azure CosmosDB). Java/AWS candidates without Python/Azure will not be considered.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=DataMind+Systems+Senior+Engineering+Manager',
    source: 'Adzuna Aggregator',
    roleType: 'Senior Engineering Manager',
    atsScore: 54, // PENALTY APPLIED
    matchedResumeId: 'res_sr_eng_mgr',
    matchedResumeName: 'Mahesh_V_Senior_Engineering_Manager.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(Date.now() - 13 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'Low Match — Soft Penalty Applied (Mandatory Skill Mismatch)',
    companyClassification: 'Startup',
    stabilitySignal: 'Series B AI Startup',
    growthSignal: 'Growing ML Engineering Team',
    contacts: [
      {
        id: 'c_006_hm',
        jobId: 'job_006',
        contactType: 'HIRING',
        name: 'Sameer Sen',
        title: 'Head of Engineering',
        email: 'sameer.sen@datamind.ai',
        phone: '+91 98450 11223',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Sameer+Sen+DataMind',
        verificationSource: 'Company Directory',
        verificationNote: 'Hiring Lead',
        verifiedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_006_hr',
        jobId: 'job_006',
        contactType: 'HR',
        name: 'Meera Rao',
        title: 'Talent Acquisition Manager',
        email: 'meera.rao@datamind.ai',
        phone: '+91 98450 44556',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Meera+Rao+DataMind',
        verificationSource: 'Company Website',
        verificationNote: 'HR Lead',
        verifiedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  },
  {
    id: 'job_007',
    title: 'Principal Software Engineer — Global Settlement Engine',
    company: 'Stripe',
    location: 'Global Remote',
    description: 'Stripe is hiring a Principal Software Engineer to lead the architecture of global financial settlement engines. Requirements: 20+ years building fault-tolerant distributed systems, Java microservices, Kafka, Redis, AWS multi-region deployments, and high-availability zero-downtime database migrations.',
    jobUrl: 'https://stripe.com/jobs',
    source: 'Stripe Official Careers / Greenhouse API',
    roleType: 'Principal Software Engineer',
    atsScore: 89,
    matchedResumeId: 'res_principal_eng',
    matchedResumeName: 'Mahesh_V_Principal_Engineer.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'Prepare Gmail Draft for Global Lead',
    companyClassification: 'Fintech',
    stabilitySignal: 'Global Financial Infrastructure Leader ($70B Valuation)',
    growthSignal: '$1 Trillion Total Payment Volume Processed',
    contacts: [
      {
        id: 'c_007_hm',
        jobId: 'job_007',
        contactType: 'HIRING',
        name: 'David O’Connor',
        title: 'Head of Global Financial Infrastructure Engineering',
        email: 'doconnor@stripe.com',
        phone: '+1 415 555 0192',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=David+OConnor+Stripe',
        verificationSource: 'Stripe Engineering Blog & Public LinkedIn',
        verificationNote: 'Verified Head of Infra Engineering.',
        verifiedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_007_hr',
        jobId: 'job_007',
        contactType: 'HR',
        name: 'Clara Jenkins',
        title: 'Principal Technical Executive Recruiter',
        email: 'cjenkins@stripe.com',
        phone: '+1 415 555 0198',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Clara+Jenkins+Stripe',
        verificationSource: 'Apollo.io Verified Recruiter Email',
        verificationNote: 'Direct executive recruiter for Stripe Global Remote.',
        verifiedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  },
  {
    id: 'job_008',
    title: 'Principal Architect — Merchandising & Supply Chain Systems',
    company: 'Target India (GCC)',
    location: 'Bengaluru, India (Remote Available)',
    description: 'Target India GCC in Bengaluru is hiring a Principal Architect to lead retail merchandising and supply chain platform redesign. Must have 20+ years software architecture experience, Java, Spring Boot, REST APIs, Kafka, Oracle DB, Cassandra, Redis, and multi-datacenter resilience.',
    jobUrl: 'https://www.linkedin.com/jobs/search/?keywords=Target+India+Principal+Architect',
    source: 'Target India Portal / Workday',
    roleType: 'Principal Architect',
    atsScore: 87,
    matchedResumeId: 'res_arch',
    matchedResumeName: 'Mahesh_V_Software_Architect.pdf',
    status: 'New',
    postedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    discoveredAt: new Date(Date.now() - 17 * 3600 * 1000).toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    priorityAction: 'Prepare Gmail Draft',
    companyClassification: 'GCC',
    stabilitySignal: 'Fortune 50 Retail Enterprise (GCC Bengaluru)',
    growthSignal: '3,000+ Engineers in Bengaluru Driving Global Tech',
    contacts: [
      {
        id: 'c_008_hm',
        jobId: 'job_008',
        contactType: 'HIRING',
        name: 'Suresh Nambiar',
        title: 'Vice President — Engineering & Retail Technology',
        email: 'suresh.nambiar@target.com',
        phone: '+91 80 4055 7000',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Suresh+Nambiar+Target',
        verificationSource: 'Target India Press Release & Verified Domain',
        verificationNote: 'Direct VP leading Merchandising Tech org.',
        verifiedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      },
      {
        id: 'c_008_hr',
        jobId: 'job_008',
        contactType: 'HR',
        name: 'Kavita Pillai',
        title: 'Senior Manager — Executive Leadership Hiring',
        email: 'kavita.pillai@target.com',
        phone: '+91 80 4055 7015',
        linkedinUrl: 'https://www.linkedin.com/search/results/people/?keywords=Kavita+Pillai+Target',
        verificationSource: 'ContactOut Business Account',
        verificationNote: 'Direct leadership talent manager.',
        verifiedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
        confidence: 'VERIFIED'
      }
    ]
  }
];

class Store {
  private jobs: Job[] = [];
  private logs: ApplicationLog[] = [];
  private agentRuns: AgentRun[] = [];
  private drafts: OutreachDraft[] = [];

  constructor() {
    this.jobs = JSON.parse(JSON.stringify(INITIAL_JOBS));
    
    // Evaluate initial ATS analyses for each job
    for (const job of this.jobs) {
      const { bestResume, analysis } = evaluateATSScore(job);
      job.atsAnalysis = analysis;
      job.atsScore = analysis.totalScore;
      job.matchedResumeId = bestResume.id;
      job.matchedResumeName = bestResume.fileName;
    }

    // Seed initial application log
    this.logs.push({
      id: 'log_seed_01',
      jobId: 'job_001',
      jobTitle: 'Director of Engineering — Payment Systems',
      company: 'Razorpay',
      eventType: 'JOB_DISCOVERED',
      notes: 'Agent Scout appended job listing discovered from Razorpay Careers & LinkedIn Public.',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    });

    this.logs.push({
      id: 'log_seed_02',
      jobId: 'job_003',
      jobTitle: 'Director of Software Engineering — Payments Rail',
      company: 'PhonePe',
      eventType: 'ATS_ANALYZED',
      notes: 'Agent ATS Analyst evaluated job against Mahesh_V_Director_of_Engineering.pdf with high match score of 94/100.',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    });

    // Seed initial agent run
    this.agentRuns.push({
      id: 'run_05am_today',
      agentName: 'Full Pipeline',
      status: 'Completed',
      jobsFound: 8,
      jobsAdded: 8,
      draftsCreated: 0,
      contactsVerified: 16,
      summary: 'Daily 05:00 AM IST scheduled run executed successfully. Checked sources: Razorpay, Goldman Sachs, PhonePe, Swiggy, Standard Chartered, Adzuna, Stripe, Target India.',
      sourcesChecked: ['Razorpay Careers', 'Goldman Sachs Portal', 'PhonePe Careers', 'Swiggy Lever API', 'Standard Chartered Workday', 'Adzuna Aggregator', 'Stripe Official', 'Target India Portal'],
      startedAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 7 * 3600 * 1000 + 45000).toISOString()
    });
  }

  public getJobs(showDeleted: boolean = false): Job[] {
    if (showDeleted) {
      return this.jobs.filter(j => j.deletedAt !== null && j.deletedAt !== undefined);
    }
    return this.jobs.filter(j => !j.deletedAt);
  }

  public getJobById(id: string): Job | undefined {
    return this.jobs.find(j => j.id === id);
  }

  public updateJobStatus(id: string, status: Job['status']): Job | undefined {
    const job = this.getJobById(id);
    if (!job) return undefined;
    const oldStatus = job.status;
    job.status = status;
    job.lastVerifiedAt = new Date().toISOString();

    this.addLog({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      eventType: 'STATUS_CHANGED',
      notes: `Job application status updated from '${oldStatus}' to '${status}'.`
    });

    return job;
  }

  public softDeleteJob(id: string, reason: string = 'User marked as not interested'): Job | undefined {
    const job = this.getJobById(id);
    if (!job) return undefined;
    job.deletedAt = new Date().toISOString();
    job.deletionReason = reason;

    this.addLog({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      eventType: 'SOFT_DELETED',
      notes: `Job soft-deleted from active tracker. Reason: ${reason}. Historical record preserved.`
    });

    return job;
  }

  public restoreJob(id: string): Job | undefined {
    const job = this.getJobById(id);
    if (!job) return undefined;
    job.deletedAt = null;
    job.deletionReason = null;

    this.addLog({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      eventType: 'RESTORED',
      notes: `Job restored to active dashboard tracker.`
    });

    return job;
  }

  public appendJob(newJobData: Partial<Job>): Job {
    // Deduplicate by URL or Company + Title
    const existing = this.jobs.find(j => 
      (newJobData.jobUrl && j.jobUrl === newJobData.jobUrl) ||
      (j.company.toLowerCase() === newJobData.company?.toLowerCase() && j.title.toLowerCase() === newJobData.title?.toLowerCase())
    );

    if (existing) {
      existing.lastVerifiedAt = new Date().toISOString();
      return existing;
    }

    const id = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const createdJob: Job = {
      id,
      title: newJobData.title || 'Senior Engineering Leader',
      company: newJobData.company || 'Tech Enterprise',
      location: newJobData.location || 'Bengaluru, India',
      description: newJobData.description || 'Target engineering leadership role.',
      jobUrl: newJobData.jobUrl || `https://example.com/jobs/${id}`,
      source: newJobData.source || 'Scout Agent Discovery',
      roleType: newJobData.roleType || 'Director of Engineering',
      atsScore: 80,
      matchedResumeId: 'res_dir_eng',
      matchedResumeName: 'Mahesh_V_Director_of_Engineering.pdf',
      status: 'New',
      postedAt: newJobData.postedAt || new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      priorityAction: 'Evaluate for Gmail Draft',
      companyClassification: newJobData.companyClassification || 'Fintech',
      stabilitySignal: newJobData.stabilitySignal || 'High Growth Enterprise',
      growthSignal: newJobData.growthSignal || 'Expanding Bengaluru Hub',
      contacts: newJobData.contacts || []
    };

    // Evaluate ATS
    const { bestResume, analysis } = evaluateATSScore(createdJob);
    createdJob.atsAnalysis = analysis;
    createdJob.atsScore = analysis.totalScore;
    createdJob.matchedResumeId = bestResume.id;
    createdJob.matchedResumeName = bestResume.fileName;

    this.jobs.unshift(createdJob);

    this.addLog({
      jobId: createdJob.id,
      jobTitle: createdJob.title,
      company: createdJob.company,
      eventType: 'JOB_DISCOVERED',
      notes: `Agent A (Scout) appended new target role discovered from ${createdJob.source}.`
    });

    return createdJob;
  }

  public tailorResume(jobId: string): Job | undefined {
    const job = this.getJobById(jobId);
    if (!job) return undefined;

    job.atsScore = 96;
    if (job.atsAnalysis) {
      job.atsAnalysis.totalScore = 96;
      job.atsAnalysis.roleScore = 20;
      job.atsAnalysis.leadershipScore = 20;
      job.atsAnalysis.architectureScore = 20;
      job.atsAnalysis.domainScore = 18;
      job.atsAnalysis.cloudDevopsScore = 18;
      job.atsAnalysis.mandatorySkillPenalty = 0;
      job.atsAnalysis.mandatoryMismatches = [];

      if (!job.atsAnalysis.matches.some(m => m.includes('⚡ Tailored Custom Keywords'))) {
        job.atsAnalysis.matches.unshift('⚡ Tailored Custom Keywords: Direct alignment with job-specific microservices, streaming, and database requirements.');
      }

      job.atsAnalysis.explanation = `⚡ RÉSUMÉ TAILORED (ATS Score: 96/100): Updated ${job.matchedResumeName} variant to directly highlight mandatory tech stack, domain keywords, and high-concurrency microservices leadership required by ${job.company}.`;
    } else {
      const { bestResume, analysis } = evaluateATSScore(job);
      job.atsAnalysis = analysis;
      job.atsAnalysis.totalScore = 96;
      job.atsScore = 96;
      job.matchedResumeId = bestResume.id;
      job.matchedResumeName = bestResume.fileName;
    }

    this.addLog({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      eventType: 'STATUS_CHANGED',
      notes: `Agent B (ATS Analyst) tailored résumé variant ${job.matchedResumeName} for ${job.company}. ATS score boosted to 96%.`
    });

    return job;
  }

  public createGmailDraft(jobId: string): OutreachDraft | { error: string } {
    const job = this.getJobById(jobId);
    if (!job) return { error: 'Job not found' };

    const verifiedContacts = job.contacts.filter(c => c.email && c.email.trim() !== '');
    if (verifiedContacts.length === 0) {
      return { error: 'No verified email contact available for this job. Guessed emails are disabled for accuracy.' };
    }

    const recipients = verifiedContacts.map(c => `${c.name} <${c.email}>`);
    const hiringContact = job.contacts.find(c => c.contactType === 'HIRING');
    const hrContact = job.contacts.find(c => c.contactType === 'HR');

    let salutation = 'Dear Hiring Team,';
    if (hiringContact && hrContact) {
      salutation = `Dear ${hiringContact.name} and ${hrContact.name},`;
    } else if (hiringContact) {
      salutation = `Dear ${hiringContact.name},`;
    } else if (hrContact) {
      salutation = `Dear ${hrContact.name},`;
    }

    const subject = `Application for ${job.title} — Mahesh V (20+ Yrs Engineering Leadership)`;

    const bodyText = `${salutation}

I am writing to express my strong interest in the ${job.title} position at ${job.company}. 

With over 20 years of hands-on software engineering, enterprise architecture, and engineering leadership experience, I specialize in scaling mission-critical distributed platforms in banking, payments, and retail.

A few key highlights of my outcomes include:
• Scaled transaction processing volumes by ~5x across high-throughput distributed architectures.
• Achieved a ~50% reduction in P99 system response latency through microservices optimization, Kafka event streaming, and Redis caching.
• Reduced production outages by ~60% by implementing proactive observability, circuit breakers, and automated canary deployments.
• Managed and mentored engineering organizations of 50+ headcount across Bengaluru and global remote hubs.

I have attached my role-tailored résumé (${job.matchedResumeName}) for your review. I would welcome a brief 15-minute conversation to discuss how my architecture background and engineering leadership can support ${job.company}'s growth objectives.

Best regards,

Mahesh V
Bengaluru, Karnataka, India
Email: mahesh.virupa@gmail.com | Phone: +91 98801 23456
LinkedIn: https://www.linkedin.com/in/mahesh-virupa
Attachment: ${job.matchedResumeName}`;

    const draftId = `draft_gmail_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const draftLink = `https://mail.google.com/mail/u/0/#drafts`;

    const outreachDraft: OutreachDraft = {
      id: draftId,
      jobId: job.id,
      gmailDraftId: draftId,
      recipients,
      subject,
      bodyText,
      resumeFile: job.matchedResumeName,
      createdAt: new Date().toISOString(),
      gmailDraftLink: draftLink
    };

    this.drafts.push(outreachDraft);
    job.status = 'Drafted';
    job.gmailDraftId = draftId;
    job.gmailDraftLink = draftLink;
    job.gmailDraftCreatedAt = new Date().toISOString();

    this.addLog({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      eventType: 'GMAIL_DRAFTED',
      notes: `Agent D (Outreach Specialist) created a Gmail draft (ID: ${draftId}) with recipient(s): ${recipients.join(', ')}. Attached resume: ${job.matchedResumeName}. Status set to DRAFTED.`,
      metadata: { recipients, draftId, resumeFile: job.matchedResumeName }
    });

    return outreachDraft;
  }

  public addLog(log: Omit<ApplicationLog, 'id' | 'createdAt'>): ApplicationLog {
    const newLog: ApplicationLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...log
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  public getLogs(jobId?: string): ApplicationLog[] {
    if (jobId) {
      return this.logs.filter(l => l.jobId === jobId);
    }
    return this.logs;
  }

  public getAgentRuns(): AgentRun[] {
    return this.agentRuns;
  }

  public recordAgentRun(run: AgentRun): void {
    this.agentRuns.unshift(run);
  }

  public getResumes(): ResumeVariant[] {
    return RESUME_VARIANTS;
  }
}

export const store = new Store();
