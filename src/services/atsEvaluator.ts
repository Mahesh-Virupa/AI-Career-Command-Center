import { ATSAnalysis, Job, ResumeVariant } from '../types';
import { MAHESH_PROFILE, RESUME_VARIANTS } from '../data/candidate';

export function evaluateATSScore(job: Job): { bestResume: ResumeVariant; analysis: ATSAnalysis } {
  const descLower = job.description.toLowerCase();
  const titleLower = job.title.toLowerCase();

  // 1. Select Best Résumé Variant based on job title & responsibilities
  let bestResume = RESUME_VARIANTS[0]; // default Director of Engineering
  if (titleLower.includes('architect')) {
    bestResume = RESUME_VARIANTS.find(r => r.id === 'res_arch') || RESUME_VARIANTS[3];
  } else if (titleLower.includes('principal') || titleLower.includes('staff') || titleLower.includes('tech lead')) {
    bestResume = RESUME_VARIANTS.find(r => r.id === 'res_principal_eng') || RESUME_VARIANTS[2];
  } else if (titleLower.includes('senior engineering manager') || titleLower.includes('engineering manager')) {
    bestResume = RESUME_VARIANTS.find(r => r.id === 'res_sr_eng_mgr') || RESUME_VARIANTS[1];
  } else {
    bestResume = RESUME_VARIANTS.find(r => r.id === 'res_dir_eng') || RESUME_VARIANTS[0];
  }

  // 2. Component Scoring (0-20 each)
  let roleScore = 15;
  let leadershipScore = 16;
  let architectureScore = 17;
  let domainScore = 15;
  let cloudDevopsScore = 16;

  const matches: string[] = [];
  const gaps: string[] = [];
  const mandatoryMismatches: string[] = [];
  let mandatorySkillPenalty = 0;

  // Seniority & Role check
  if (titleLower.includes('director') || titleLower.includes('head') || titleLower.includes('vp') || titleLower.includes('principal')) {
    roleScore = 19;
    matches.push('20+ years senior engineering leadership & enterprise experience matches target role');
  } else {
    roleScore = 17;
    matches.push('Senior engineering management experience matches title requirement');
  }

  // Tech matches
  if (descLower.includes('java') || descLower.includes('spring boot') || descLower.includes('j2ee')) {
    matches.push('Mandatory Java / Spring Boot microservices expertise matched');
  } else {
    gaps.push('Job description lacks explicit Java/Spring Boot emphasis');
  }

  if (descLower.includes('kafka') || descLower.includes('event driven') || descLower.includes('messaging')) {
    matches.push('High-throughput Apache Kafka event streaming alignment matched');
  }

  if (descLower.includes('aws') || descLower.includes('cloud')) {
    matches.push('AWS Cloud ecosystem & Kubernetes microservices matched');
  }

  if (descLower.includes('banking') || descLower.includes('fintech') || descLower.includes('payment') || descLower.includes('retail')) {
    domainScore = 19;
    matches.push('Direct domain match in Banking, Payments, or Retail systems');
  } else {
    domainScore = 14;
    gaps.push('Job is outside core banking/fintech/retail domains');
  }

  // 3. MANDATORY MISMATCH RULE ENGINE (CRITICAL)
  // Check for non-candidate mandatory technologies
  const missingTechChecks = [
    { key: 'python', label: 'Python', candidateAlternative: 'Java / Spring Boot' },
    { key: 'azure', label: 'Microsoft Azure', candidateAlternative: 'Amazon Web Services (AWS)' },
    { key: 'golang', label: 'Go / Golang', candidateAlternative: 'Java' },
    { key: 'c#', label: 'C# / .NET', candidateAlternative: 'Java / J2EE' },
    { key: '.net', label: '.NET Core', candidateAlternative: 'Spring Boot' },
    { key: 'ruby', label: 'Ruby on Rails', candidateAlternative: 'Java' },
    { key: 'react native', label: 'React Native', candidateAlternative: 'Backend Architecture' },
  ];

  for (const check of missingTechChecks) {
    // Determine if description strictly requires it as mandatory
    const mandatoryRegex = new RegExp(`(mandatory|required|must have|expert in|strong experience in|minimum \\d+ years of)\\s+[^.]*\\b${check.key}\\b`, 'i');
    const isExplicitlyMandatory = mandatoryRegex.test(descLower) || (descLower.includes(check.key) && (descLower.includes('must have') || descLower.includes('required skill')));

    if (isExplicitlyMandatory) {
      mandatoryMismatches.push(`Job mandates ${check.label}, which is absent from candidate profile (Candidate stack: ${check.candidateAlternative}).`);
      mandatorySkillPenalty += 35;
    }
  }

  // If penalty was incurred, cap the total score below 80
  let rawTotal = roleScore + leadershipScore + architectureScore + domainScore + cloudDevopsScore;
  let finalScore = Math.max(0, rawTotal - mandatorySkillPenalty);

  if (mandatoryMismatches.length > 0) {
    // Ensure cap strictly below 80
    finalScore = Math.min(finalScore, 62);
  }

  // Craft clear explanation
  let explanation = `ATS evaluated against ${bestResume.displayName}. Total alignment score: ${finalScore}/100. `;
  if (mandatoryMismatches.length > 0) {
    explanation += `MISMATCH PENALTY (-${mandatorySkillPenalty} pts applied): ${mandatoryMismatches.join(' ')} Candidate's leadership & AWS/Java experience cannot cancel mandatory skill gaps for absent technologies per Mahesh's profile rules. Score capped below 80 match threshold.`;
  } else if (finalScore >= 80) {
    explanation += `High match (${finalScore}/100)! Candidate profile exhibits strong alignment across Java microservices, Kafka streaming, AWS Cloud, and engineering team leadership (50+ engineers). Recommended for immediate Gmail outreach.`;
  } else {
    explanation += `Moderate match (${finalScore}/100). Secondary alignment noted, but minor domain or specialized stack differences exist.`;
  }

  const analysis: ATSAnalysis = {
    id: `ats_${job.id}_${Date.now()}`,
    jobId: job.id,
    resumeId: bestResume.id,
    resumeName: bestResume.fileName,
    totalScore: finalScore,
    roleScore,
    leadershipScore,
    architectureScore,
    domainScore,
    cloudDevopsScore,
    mandatorySkillPenalty,
    matches,
    gaps,
    mandatoryMismatches,
    explanation,
    created_at: new Date().toISOString()
  };

  return { bestResume, analysis };
}
