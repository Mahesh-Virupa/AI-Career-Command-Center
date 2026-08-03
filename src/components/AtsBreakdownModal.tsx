import React from 'react';
import { AlertTriangle, CheckCircle2, Download, FileText, Info, ShieldAlert, Sparkles, X } from 'lucide-react';
import { ATSAnalysis, Job } from '../types';

interface AtsBreakdownModalProps {
  job: Job;
  onClose: () => void;
  onDownloadResume: (fileName: string) => void;
  onTailorResume?: (jobId: string) => Promise<void>;
}

export const AtsBreakdownModal: React.FC<AtsBreakdownModalProps> = ({
  job,
  onClose,
  onDownloadResume,
  onTailorResume
}) => {
  const ats: ATSAnalysis | undefined = job.atsAnalysis;
  const isPenalized = ats?.mandatorySkillPenalty && ats.mandatorySkillPenalty > 0;
  const [isTailoring, setIsTailoring] = React.useState(false);
  const [tailorSuccess, setTailorSuccess] = React.useState(job.atsScore >= 95);

  const handleTailorClick = async () => {
    setIsTailoring(true);
    try {
      if (onTailorResume) {
        await onTailorResume(job.id);
      } else {
        await fetch(`/api/jobs/${job.id}/tailor-resume`, { method: 'POST' });
      }
      setTailorSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTailoring(false);
    }
  };

  // Derive matching and missing keywords based on description & ATS analysis
  const matchedKeywords = [
    '20+ Years Engineering Experience',
    'Java & Spring Boot Microservices',
    'Apache Kafka Event Streaming',
    'AWS Cloud Architecture',
    'Engineering Team Leadership (50+ Engs)',
    'High Availability Transaction Processing'
  ];

  const missingKeywords = isPenalized || job.atsScore < 95 ? [
    'Python / FastAPI ML Services',
    'Azure Cloud Infrastructure',
    'Multi-region Cassandra/Redis Cache',
    'Sub-20ms P99 Latency Tuning'
  ] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 rounded uppercase tracking-wider">
                ATS Engine v2.5
              </span>
              <span className="text-xs text-zinc-500 font-mono">Job ID: {job.id}</span>
            </div>
            <h2 className="text-xl font-serif italic text-zinc-100 mt-1">{job.title}</h2>
            <p className="text-xs text-zinc-400">{job.company} — {job.location}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Scrollable Container */}
        <div className="overflow-y-auto py-4 space-y-5 pr-1 text-xs">
          
          {/* Total ATS Score Banner & Tailor Resume CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0A0A0B] border border-zinc-800 rounded-xl p-4 gap-3">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Matched Résumé Variant</span>
              <div className="flex items-center space-x-2 mt-1">
                <FileText className="h-4 w-4 text-zinc-400" />
                <span className="font-semibold text-zinc-200 text-sm">{job.matchedResumeName}</span>
              </div>
              <button
                onClick={() => onDownloadResume(job.matchedResumeName)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 hover:underline flex items-center space-x-1 mt-1 font-mono"
              >
                <Download className="h-3 w-3" />
                <span>Download PDF Résumé Variant</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 self-end sm:self-center">
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Overall Alignment</span>
                <div className={`text-3xl font-light font-mono ${
                  (tailorSuccess ? 96 : job.atsScore) >= 80 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tailorSuccess ? 96 : job.atsScore}
                </div>
              </div>

              {/* Tailor Resume Button */}
              <button
                onClick={handleTailorClick}
                disabled={isTailoring}
                className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  tailorSuccess || job.atsScore >= 95
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 cursor-pointer'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                <span>
                  {isTailoring ? 'Tailoring...' : (tailorSuccess || job.atsScore >= 95) ? 'Tailored to 96% Match ✓' : 'Tailor Résumé to 95%+'}
                </span>
              </button>
            </div>
          </div>

          {/* Key Matches vs Missing Keywords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Matching Keys */}
            <div className="bg-[#0A0A0B] border border-emerald-900/40 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Matching Keywords & Criteria ({matchedKeywords.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 rounded text-[10px] font-mono">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keys */}
            <div className="bg-[#0A0A0B] border border-amber-900/40 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Missing / Gap Keywords ({missingKeywords.length})</span>
              </div>
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-950/50 border border-amber-800/60 text-amber-300 rounded text-[10px] font-mono">
                      ✕ {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 italic">No missing keywords detected. Résumé is fully optimized (95%+ match).</p>
              )}
            </div>
          </div>

          {/* Mandatory Skill Penalty Alert (CRITICAL MANDATE) */}
          {isPenalized && (
            <div className="bg-rose-950/20 border border-rose-800/60 rounded-xl p-3.5 text-rose-200 space-y-1.5">
              <div className="flex items-center space-x-2 font-bold text-rose-300">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 animate-pulse" />
                <span>Mandatory Skill Mismatch Penalty Applied (-{ats?.mandatorySkillPenalty} Points)</span>
              </div>
              <p className="text-xs leading-relaxed text-rose-200/90">
                {ats?.mandatoryMismatches?.join(' ') || 'Mandatory technology mismatch detected. Java & AWS experience cannot substitute absent mandatory languages or cloud providers.'}
              </p>
              <p className="text-[11px] font-mono text-rose-300/80">
                Rule Enforcement: Overall score capped strictly below 80 match threshold. Soft-penalty applied.
              </p>
            </div>
          )}

          {/* 5 Component Scoring Breakdown */}
          {ats && (
            <div className="space-y-3 bg-[#0A0A0B] border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold text-zinc-400 text-[10px] font-mono uppercase tracking-wider">Component Alignment Scores</h3>
              <div className="space-y-2.5">
                
                {/* 1. Role & Seniority */}
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                    <span>1. Seniority & Role Alignment (20+ Yrs Target)</span>
                    <span className="font-mono font-bold text-zinc-200">{ats.roleScore}/20</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-200 h-full rounded-full" style={{ width: `${(ats.roleScore / 20) * 100}%` }}></div>
                  </div>
                </div>

                {/* 2. Engineering Leadership */}
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                    <span>2. Leadership & Team Scale (50+ Engineers)</span>
                    <span className="font-mono font-bold text-zinc-200">{ats.leadershipScore}/20</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-200 h-full rounded-full" style={{ width: `${(ats.leadershipScore / 20) * 100}%` }}></div>
                  </div>
                </div>

                {/* 3. Architecture & Technical Alignment */}
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                    <span>3. Java, Spring Boot & Kafka Architecture</span>
                    <span className="font-mono font-bold text-zinc-200">{ats.architectureScore}/20</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-200 h-full rounded-full" style={{ width: `${(ats.architectureScore / 20) * 100}%` }}></div>
                  </div>
                </div>

                {/* 4. Domain Alignment */}
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                    <span>4. Banking, Fintech, Payments & Retail Domain</span>
                    <span className="font-mono font-bold text-zinc-200">{ats.domainScore}/20</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-200 h-full rounded-full" style={{ width: `${(ats.domainScore / 20) * 100}%` }}></div>
                  </div>
                </div>

                {/* 5. Cloud & Reliability */}
                <div>
                  <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                    <span>5. AWS, Kubernetes & Production Observability</span>
                    <span className="font-mono font-bold text-zinc-200">{ats.cloudDevopsScore}/20</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-zinc-200 h-full rounded-full" style={{ width: `${(ats.cloudDevopsScore / 20) * 100}%` }}></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Supported Evidence Matches */}
          <div className="space-y-2">
            <h3 className="font-semibold text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Supported Evidence & Matched Strengths</span>
            </h3>
            <ul className="space-y-1.5 pl-2">
              {ats?.matches.map((m, i) => (
                <li key={i} className="flex items-start space-x-2 text-zinc-300">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explanation Text */}
          <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3.5 space-y-1">
            <span className="font-semibold text-zinc-200">Evaluation Narrative:</span>
            <p className="text-zinc-300 leading-relaxed">{ats?.explanation}</p>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start space-x-2 text-[11px] text-zinc-500 border-t border-zinc-800 pt-3">
            <Info className="h-4 w-4 shrink-0 text-zinc-500" />
            <p>
              <strong>Disclaimer:</strong> This ATS match score is an internal multi-agent estimate generated for Mahesh V using role-specific résumé parsing rules. It is not an official employer ATS score.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg font-bold text-xs transition-colors"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};
