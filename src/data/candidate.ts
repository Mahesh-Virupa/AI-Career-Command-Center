import { CandidateProfile, ResumeVariant } from '../types';

export const MAHESH_PROFILE: CandidateProfile = {
  name: 'Mahesh V',
  email: 'mahesh.virupa@gmail.com',
  phone: '+91 98801 23456',
  location: 'Bengaluru, India',
  experienceYears: 22,
  coreSkills: [
    'Java',
    'J2EE',
    'Spring Boot',
    'REST APIs',
    'Microservices',
    'Kafka',
    'Distributed Systems',
    'High Availability',
    'Observability & Reliability'
  ],
  databases: ['SQL', 'Oracle', 'DB2', 'Cassandra', 'Redis'],
  cloudAndOps: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'DevOps'],
  domains: ['Banking', 'Payments', 'Mortgages', 'Retail', 'Merchandising Systems'],
  outcomes: {
    transactionScaling: 'Scaled transaction volume by ~5x across core banking & payment rails',
    latencyReduction: 'Reduced P99 service latency by ~50% through microservice redesign and Redis caching',
    incidentReduction: 'Reduced production incidents by ~60% via circuit breakers, telemetry, and automated rollbacks',
    availability: 'Maintained 99.99% multi-region platform availability across peak merchant trading events'
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
    id: 'res_dir_eng',
    roleType: 'Director of Engineering',
    displayName: 'Director of Engineering Résumé',
    fileName: 'Mahesh_V_Director_of_Engineering.pdf',
    storagePath: '/resumes/Mahesh_V_Director_of_Engineering.pdf',
    keywords: [
      'Engineering Leadership',
      'Director of Engineering',
      'Team Building (50+ Engineers)',
      'Strategic Vision',
      'Spring Boot Architecture',
      'Kafka Event-Driven Platform',
      'AWS Cloud Governance',
      'Fintech & Banking Scale',
      'Budget & Resource Management'
    ],
    targetRoles: [
      'Director of Engineering',
      'Director of Software Engineering',
      'Engineering Senior Manager',
      'Platform Engineering Leader'
    ],
    extractedText: `MAHESH V
Bengaluru, Karnataka, India | mahesh.virupa@gmail.com | +91 98801 23456 | linkedin.com/in/mahesh-virupa

SUMMARY:
Results-driven Engineering Leader & Director of Software Engineering with 20+ years of enterprise experience building scalable distributed platforms in Banking, Payments, Mortgages, and Retail. Proven track record leading multi-disciplinary engineering teams (50+ headcount), driving technical roadmaps, and modernizing legacy monoliths into high-throughput Java/Spring Boot microservices on AWS and Kubernetes.

CORE COMPETENCIES:
• Leadership: Engineering Strategy, Team Scaling, Org Design, Hiring, Talent Mentorship, Budgeting.
• Architecture & Tech Stack: Java, J2EE, Spring Boot, REST APIs, Microservices, Apache Kafka, Distributed Systems.
• Data & Caching: SQL, Oracle, DB2, Apache Cassandra, Redis.
• Cloud & DevOps: AWS (EC2, EKS, S3, RDS, IAM), Kubernetes, Docker, CI/CD, Observability, Production Reliability.
• Domain Expertise: Core Banking, Payment Gateway Rails, Mortgage Origination, Retail Merchandising.

KEY OUTCOMES & ACHIEVEMENTS:
• Scaled transaction processing volume by 5x to support 50M+ daily active operations.
• Reduced P99 system response latency by 50% across payment checkout gateways.
• Decreased critical P1/P2 production incidents by 60% through proactive observability & circuit breakers.
• Built and mentored high-performing engineering organizations across Bengaluru and global remote hubs.`
  },
  {
    id: 'res_sr_eng_mgr',
    roleType: 'Senior Engineering Manager',
    displayName: 'Senior Engineering Manager Résumé',
    fileName: 'Mahesh_V_Senior_Engineering_Manager.pdf',
    storagePath: '/resumes/Mahesh_V_Senior_Engineering_Manager.pdf',
    keywords: [
      'Senior Engineering Manager',
      'People Management',
      'Agile Execution',
      'Sprint Delivery',
      'Java & Spring Boot',
      'Kafka Streaming',
      'DevOps Practices',
      'Mentorship & Hiring',
      'High-Availability Systems'
    ],
    targetRoles: [
      'Senior Engineering Manager',
      'Engineering Senior Manager'
    ],
    extractedText: `MAHESH V
Bengaluru, Karnataka, India | mahesh.virupa@gmail.com | +91 98801 23456 | linkedin.com/in/mahesh-virupa

SUMMARY:
Senior Engineering Manager with 20+ years of software engineering expertise and 8+ years leading high-performing engineering squads delivering mission-critical Java, Spring Boot, and Kafka microservices in banking and retail domains. Expert in agile delivery, engineering execution, technical mentorship, and platform reliability.

CORE COMPETENCIES:
• People & Delivery Management: OKRs, Agile Execution, Performance Reviews, Cross-functional Stakeholder Management.
• Engineering & Systems: Java, Spring Boot, Microservices, RESTful APIs, Event-Driven Architecture with Kafka.
• Databases & Infrastructure: Oracle, DB2, Cassandra, Redis, AWS, Kubernetes, Docker, Terraform, CI/CD pipelines.
• Quality & Operations: Telemetry (Prometheus, Grafana), Incident Command, Disaster Recovery, SLO/SLA Management.

KEY OUTCOMES:
• Led 4 engineering squads (30+ engineers) delivering 99.99% availability for core payment settlement APIs.
• Cut customer ticket resolution time by 45% by championing automated regression suites and CI/CD pipelines.
• Reduced production outages by 60% through automated rollbacks and canary deployments.`
  },
  {
    id: 'res_principal_eng',
    roleType: 'Principal Engineer',
    displayName: 'Principal Engineer Résumé',
    fileName: 'Mahesh_V_Principal_Engineer.pdf',
    storagePath: '/resumes/Mahesh_V_Principal_Engineer.pdf',
    keywords: [
      'Principal Engineer',
      'Hands-On Distributed Systems',
      'Low Latency Optimization',
      'Java Performance Tuning',
      'Spring Boot Core',
      'Kafka Event Streaming',
      'Cassandra Data Modeling',
      'Kubernetes',
      'System Resilience'
    ],
    targetRoles: [
      'Principal Engineer',
      'Principal Software Engineer'
    ],
    extractedText: `MAHESH V
Bengaluru, Karnataka, India | mahesh.virupa@gmail.com | +91 98801 23456 | linkedin.com/in/mahesh-virupa

SUMMARY:
Hands-on Principal Software Engineer with 20+ years designing and implementing resilient, ultra-low-latency distributed platforms. Industry veteran in core Java, J2EE, Spring Boot, Kafka, and high-concurrency database architecture across financial, payment, and merchandising networks.

CORE COMPETENCIES:
• Hands-On Engineering: Deep Core Java internals, JVM Tuning, Garbage Collection, Asynchronous IO, Concurrency.
• Distributed Systems & Messaging: Apache Kafka, Event Sourcing, CQRS, Distributed Locking, Redis Caching.
• Data Persistence: SQL Tuning, Oracle DB, IBM DB2, Apache Cassandra Columnar Data Modeling.
• Cloud Native Architecture: AWS Cloud infrastructure, Docker, Kubernetes deployment, Helm, Service Mesh.

KEY OUTCOMES:
• Engineered low-latency event processing pipeline handling 100,000 events/sec with sub-20ms latency.
• Achieved 50% latency reduction by optimizing DB queries, JVM parameters, and multi-tier Redis caching.
• Designed zero-downtime database migration strategy from legacy DB2 to high-throughput Cassandra cluster.`
  },
  {
    id: 'res_arch',
    roleType: 'Software Architect',
    displayName: 'Software Architect Résumé',
    fileName: 'Mahesh_V_Software_Architect.pdf',
    storagePath: '/resumes/Mahesh_V_Software_Architect.pdf',
    keywords: [
      'Enterprise Architect',
      'Software Architect',
      'System Design',
      'Java & Spring Boot Standard',
      'Microservices Transformation',
      'AWS Multi-Region',
      'Observability',
      'Security & Banking Standards',
      'API Gateway & gRPC'
    ],
    targetRoles: [
      'Software Architect',
      'Enterprise Architect',
      'Principal Architect'
    ],
    extractedText: `MAHESH V
Bengaluru, Karnataka, India | mahesh.virupa@gmail.com | +91 98801 23456 | linkedin.com/in/mahesh-virupa

SUMMARY:
Enterprise & Software Architect with 20+ years crafting robust enterprise blueprints, cloud-native architectures, and microservice migration strategies for global banking, payment, and retail enterprises. Proven track record establishing architectural standards, API governance, security compliance, and high availability.

CORE COMPETENCIES:
• Architecture Patterns: Domain-Driven Design (DDD), Microservices, Event-Driven Architecture, Multi-Region Active-Active.
• Technical Stack: Java, J2EE, Spring Boot, REST APIs, GraphQL, Kafka, AWS, Kubernetes, Docker.
• Data & Storage Architecture: Oracle, DB2, Cassandra, Redis, Data Replication & Consistency.
• Observability & Security: OAuth2, JWT, TLS, OpenTelemetry, Grafana, Prometheus, Disaster Recovery.

KEY OUTCOMES:
• Architected enterprise migration of legacy core banking monolith into 40+ modular Spring Boot microservices on AWS.
• Reduced production outages by 60% with fault-tolerant circuit breakers, bulkhead isolation, and auto-scaling.
• Established API governance guidelines adopted across 200+ global engineering teams.`
  }
];
