import { CandidateProfile, ResumeVariant } from '../types';

export const MAHESH_PROFILE: CandidateProfile = {
  name: 'Mahesh V',
  email: 'mahesh.virupa@gmail.com',
  phone: '+91 98865 49126',
  location: 'Bengaluru, Karnataka, India',
  experienceYears: 22,
  coreSkills: [
    'Java',
    'J2EE',
    'Spring Boot',
    'REST Services',
    'gRPC',
    'Microservices',
    'Kafka',
    'Distributed Systems',
    'High Availability',
    'Observability (Splunk, Dynatrace)',
    'Claude Code / Copilot / Cursor'
  ],
  databases: ['SQL', 'Oracle', 'DB2', 'NoSQL', 'Cassandra', 'Redis', 'MongoDB'],
  cloudAndOps: ['AWS', 'Kubernetes', 'Docker', 'OpenShift', 'CI/CD', 'Jenkins', 'GitHub Actions'],
  domains: ['Banking Payments Hubs', 'Customer Profile Management', 'Retail Merchandising Optimization', 'Loan Mortgages'],
  outcomes: {
    transactionScaling: 'Scaled transaction volume 5x baseline while cutting latency by 50%',
    latencyReduction: 'Decomposed monolithic payments to event-driven microservices, cutting downtime from 2% to 0.01%',
    incidentReduction: 'Designed observability architecture (Splunk/Dynatrace), cutting production incidents by 60%',
    availability: 'Maintained 99.99% multi-region active-active fault-tolerant payments infrastructure'
  },
  absentSkills: [
    'Python',
    'Azure',
    'Golang',
    'C#',
    '.NET',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
    'React Native'
  ]
};

export const RESUME_VARIANTS: ResumeVariant[] = [
  {
    id: 'res_arch',
    roleType: 'Software Architect',
    displayName: 'Software Architect — Enterprise & Solution Architecture',
    fileName: 'Mahesh_V_Enterprise_Solution_Architect.pdf',
    storagePath: '/resumes/Mahesh_V_Enterprise_Solution_Architect.pdf',
    keywords: [
      'Software Architect',
      'Enterprise Architecture',
      'Solution Architecture',
      'Java / J2EE',
      'Spring Boot & REST Services',
      'Kafka Event-Driven',
      'AWS & Kubernetes',
      'Multi-Region Active-Active Topologies',
      'Oracle / DB2 / Cassandra / Redis',
      'JPMorgan Chase VP'
    ],
    targetRoles: [
      'Software Architect',
      'Enterprise Architect',
      'Principal Architect'
    ],
    extractedText: `MAHESH V
Software Architect | Enterprise & Solution Architecture
Bengaluru, Karnataka | +91-9886549126 | mahesh.virupa@gmail.com | linkedin.com/in/mahesh-v-8187476

PROFILE SUMMARY
Software and Enterprise Architect with over two decades of experience designing large-scale, highly available systems in Java/J2EE (Spring Boot, REST Services, Kafka), SQL (Oracle/DB2) and NoSQL (Cassandra/Redis), and cloud-native infrastructure (AWS, Kubernetes, Docker). Deep expertise architecting highly available, fault-tolerant multi-region distributed systems, including active-active and active-passive topologies, disaster recovery planning, and data residency/sovereignty controls across jurisdictions. Led the architectural decomposition of monolithic payment and Customer Profile services into event-driven, auto-scaling microservices, cutting downtime from 2% to 0.01%. Domain expertise spans Banking Payments Hubs, Customer Profile Management, Retail Merchandising Optimization, and Loan Mortgage systems. Certified AWS Cloud Practitioner; recognized with the IBM Outstanding Technical Achievement Award.

WORK EXPERIENCE
Vice President – Banking Payments & Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Since Feb 2021
Associate Vice President - Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Oct 2017 – Feb 2021
• Own solution architecture for multi-region, fault-tolerant payments infrastructure — designing active-active/active-passive failover topologies, disaster recovery plans, and data residency/sovereignty controls.
• Lead architecture design reviews and define non-functional requirements (availability, scalability, security, compliance) for Payments and Customer Profile platforms.
• Architected the decomposition of monolithic payment services and Customer Profile Gateway Services into modular, event-driven, auto-scaling microservices, cutting downtime from 2% to 0.01%.
• Designed the architecture for Chase Bank Financial External Accounts Linkage system, scaling transaction volume to 5x baseline while cutting latency by 50%.

Senior Staff Software Engineer to Advisory Software Engineer | IBM India Pvt. Ltd. (ISL), Bengaluru | Nov 2012 - Oct 2017
System Analyst to Technical Anchor | Subex Technologies Ltd., Bengaluru | Jun 2007 - Nov 2012
Software Engineer to Senior Software Engineer | Tavant Technologies, Bengaluru | Sep 2004 - Jun 2007

EDUCATION
Bachelor of Engineering (B.E.), Mechanical Engineering — UVCE, Bengaluru | 2000 - 2004 | 76.4%`
  },
  {
    id: 'res_principal_eng',
    roleType: 'Principal Engineer',
    displayName: 'Principal Engineer — Distributed Systems & Payments',
    fileName: 'Mahesh_V_Principal_Engineer.pdf',
    storagePath: '/resumes/Mahesh_V_Principal_Engineer.pdf',
    keywords: [
      'Principal Engineer',
      'Distributed Systems Architecture',
      'Hands-On Code Review & RFC / ADR Authorship',
      'Java & Spring Boot Core',
      'Kafka Streaming',
      'Multi-Region Active-Active Topologies',
      'AWS & Kubernetes',
      'Latency Optimization & JVM Tuning',
      'AI-Assisted Workflows (Claude Code, Copilot)'
    ],
    targetRoles: [
      'Principal Engineer',
      'Principal Software Engineer'
    ],
    extractedText: `MAHESH V
Principal Engineer | Distributed Systems & Payments Architecture
Bengaluru, Karnataka | +91-9886549126 | mahesh.virupa@gmail.com | linkedin.com/in/mahesh-v-8187476

PROFILE SUMMARY
Hands-on Principal Engineer and technical leader with over two decades of experience personally writing and reviewing production code and architecting large-scale distributed systems in Java/J2EE (Spring Boot, REST Services, Kafka), SQL (Oracle/DB2) and NoSQL (Cassandra/Redis, MongoDB), and cloud-native infrastructure (AWS, Kubernetes, Docker). Author of formal design docs, RFCs, and architecture decision records (ADRs) for every major technical decision on Payments and Customer Profile platforms. Personally drove the architectural decomposition of monolithic payment and Customer Profile services into event-driven, auto-scaling microservices, cutting downtime from 2% to 0.01% and enabling bi-weekly deployments. Certified AWS Cloud Practitioner and recognized with IBM Outstanding Technical Achievement Award.

WORK EXPERIENCE
Vice President – Banking Payments & Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Since Feb 2021
Associate Vice President - Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Oct 2017 – Feb 2021
• Personally write and review production code and author formal RFCs / ADRs for every major technical decision across Payments and Customer Profile platforms.
• Architected and hand-coded critical components of multi-region, fault-tolerant distributed payments infrastructure.
• Run regular 1:1 technical deep-dives with senior and staff engineers on hard distributed-systems problems.
• Authored technical design and RFC for, and personally coded core components of, Chase Bank Financial External Accounts Linkage system on AWS, scaling transaction volume 5x while cutting latency 50%.

Senior Staff Software Engineer to Advisory Software Engineer | IBM India Pvt. Ltd., Bengaluru | Nov 2012 - Oct 2017
System Analyst to Technical Anchor | Subex Technologies Ltd., Bengaluru | Jun 2007 - Nov 2012
Software Engineer to Senior Software Engineer | Tavant Technologies, Bengaluru | Sep 2004 - Jun 2007`
  },
  {
    id: 'res_dir_eng',
    roleType: 'Director of Engineering',
    displayName: 'Director Of Engineering — Vice President, Engineering',
    fileName: 'Mahesh_V_Director_Of_Engineering.pdf',
    storagePath: '/resumes/Mahesh_V_Director_Of_Engineering.pdf',
    keywords: [
      'Director of Engineering',
      'VP Engineering',
      'Engineering Strategy & Technical Vision',
      'Org Scaling (50+ Engineers)',
      'OKRs & Goal Setting',
      'AI-First Engineering Culture',
      'Payments & Customer Profile Platforms',
      'Vendor & Budget Management',
      'JPMorgan Chase Vice President'
    ],
    targetRoles: [
      'Director of Engineering',
      'Director of Software Engineering',
      'Platform Engineering Leader'
    ],
    extractedText: `MAHESH V
Director Of Engineering | Vice President, Engineering
Bengaluru, Karnataka | +91-9886549126 | mahesh.virupa@gmail.com | linkedin.com/in/mahesh-v-8187476

PROFILE SUMMARY
Seasoned technology leader with over two decades of experience in software engineering, enterprise architecture, and product development, with deep expertise using AI-assisted development in Java/J2EE (Spring Boot, REST Services, Kafka), SQL (Oracle/DB2) and NoSQL (Cassandra/Redis) databases, and DevOps tools (CI/CD, Kubernetes, Docker). Currently Vice President at JPMorgan Chase, owning engineering strategy, technical vision, organizational scaling, and program financial forecasting across Payments and Customer Profile platforms. Track record of building and scaling high-performing global engineering organizations to 50+ engineers and architects, including hiring, onboarding, mentorship, performance management, and succession planning for engineering managers.

WORK EXPERIENCE
Vice President – Banking Payments & Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Since Feb 2021
Associate Vice President - Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Oct 2017 – Feb 2021
• Own engineering strategy, technical vision, and organizational scaling for cross-functional engineering organization of 10–30 engineers, including 4+ people managers, across direct and vendor/outsourced teams (Accenture, Infosys, Virtusa).
• Grew Customer Profile Management engineering organization from 2 to 50+ engineers and architects across geographies.
• Set OKRs and quarterly goals for engineering managers and their teams, holding teams accountable to delivery and reliability outcomes.
• Champion an AI-first engineering culture, driving org-wide adoption of Generative AI and LLM tooling (Claude Code, Codex, Copilot, Cursor, MCP).

Senior Staff Software Engineer to Advisory Software Engineer | IBM India Pvt. Ltd. | Nov 2012 - Oct 2017
System Analyst to Technical Anchor | Subex Technologies Ltd. | Jun 2007 - Nov 2012
Software Engineer to Senior Software Engineer | Tavant Technologies | Sep 2004 - Jun 2007`
  },
  {
    id: 'res_sr_eng_mgr',
    roleType: 'Senior Engineering Manager',
    displayName: 'Senior Engineering Manager — Vice President',
    fileName: 'Mahesh_V_Senior_Engineering_Manager.pdf',
    storagePath: '/resumes/Mahesh_V_Senior_Engineering_Manager.pdf',
    keywords: [
      'Senior Engineering Manager',
      'Agile / Scrum Sprint Delivery',
      '1:1 Coaching & Career Development',
      'People Management (10-30 Engineers)',
      'Hiring & Onboarding Pipelines',
      'Incident & On-Call Management',
      'Java & Spring Boot Ecosystem',
      'Kafka Event-Driven Microservices',
      'Observability (Splunk / Dynatrace)'
    ],
    targetRoles: [
      'Senior Engineering Manager',
      'Engineering Senior Manager'
    ],
    extractedText: `MAHESH V
Senior Engineering Manager | Vice President
Bengaluru, Karnataka | +91-9886549126 | mahesh.virupa@gmail.com | linkedin.com/in/mahesh-v-8187476

PROFILE SUMMARY
Hands-on Senior Engineering Manager with over two decades of experience leading engineering teams, coaching people managers, and delivering mission-critical software in Java/J2EE (Spring Boot, REST Services, Kafka), SQL (Oracle/DB2) and NoSQL (Cassandra/Redis), and DevOps tooling (CI/CD, Kubernetes, Docker). Currently Vice President at JPMorgan Chase, directly managing a cross-functional engineering organization of 10–30 engineers, including 4+ people managers, running Agile/Scrum sprint delivery, 1:1 coaching, career development, and performance reviews. Proven ability to grow teams while protecting delivery quality — scaled Customer Profile Management organization from 2 to 50+ engineers.

WORK EXPERIENCE
Vice President – Banking Payments & Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Since Feb 2021
Associate Vice President - Digital Global Technology | JPMorgan Chase & Co, Bengaluru, India | Oct 2017 – Feb 2021
• Directly manage cross-functional engineering team of 10–30 engineers, including 4+ people managers, across direct and vendor/outsourced teams (Accenture, Infosys, Virtusa) — running sprint planning, backlog grooming, 1:1s, and performance reviews.
• Grew Customer Profile Management team from 2 to 50+ engineers and architects.
• Coach engineering managers and senior engineers on career development, technical growth plans, and AI-generalist skill building.
• Own on-call and incident management practices for Payments platforms; championed proactive observability (Splunk, Dynatrace), cutting production incidents by 60%.

Senior Staff Software Engineer to Advisory Software Engineer | IBM India Pvt. Ltd. | Nov 2012 - Oct 2017
System Analyst to Technical Anchor | Subex Technologies Ltd. | Jun 2007 - Nov 2012
Software Engineer to Senior Software Engineer | Tavant Technologies | Sep 2004 - Jun 2007`
  }
];

