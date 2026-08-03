import React, { useState } from 'react';
import { 
  ArrowDown, ArrowUp, ArrowUpDown, BarChart3, Check, Copy, ExternalLink, FileText, 
  Linkedin, Mail, Phone, RefreshCw, RotateCcw, ShieldAlert, ShieldCheck, 
  Sparkles, Trash2, User, UserCheck, AlertTriangle 
} from 'lucide-react';
import { Job, JobStatus, SortState } from '../types';

interface JobGridTableProps {
  jobs: Job[];
  sortState: SortState;
  onSortChange: (column: SortState['column']) => void;
  onOpenAtsModal: (job: Job) => void;
  onPrepareGmailDraft: (job: Job) => void;
  onStatusChange: (jobId: string, newStatus: JobStatus) => void;
  onSoftDelete: (jobId: string) => void;
  onRestore: (jobId: string) => void;
  onDownloadResume: (fileName: string) => void;
  isDeletedView?: boolean;
}

export const JobGridTable: React.FC<JobGridTableProps> = ({
  jobs,
  sortState,
  onSortChange,
  onOpenAtsModal,
  onPrepareGmailDraft,
  onStatusChange,
  onSoftDelete,
  onRestore,
  onDownloadResume,
  isDeletedView = false
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const topScrollRef = React.useRef<HTMLDivElement>(null);
  const tableScrollRef = React.useRef<HTMLDivElement>(null);

  const handleTopScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const handleTableScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const getSortIcon = (column: SortState['column']) => {
    if (sortState.column !== column) {
      return <ArrowUpDown className="h-3 w-3 text-slate-500 opacity-50" />;
    }
    return sortState.direction === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-indigo-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-400" />
    );
  };

  const formatIST = (isoString: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-xl shadow-xl relative">
      {/* Sticky Floating Top Horizontal Scrollbar — stays at viewport top as user scrolls down */}
      <div 
        ref={topScrollRef} 
        onScroll={handleTopScroll} 
        className="sticky top-0 z-30 overflow-x-auto bg-[#0A0A0C]/95 backdrop-blur-md border-b border-indigo-900/50 py-1.5 px-3 flex items-center justify-between text-[10px] font-mono text-zinc-300 select-none cursor-pointer shadow-md rounded-t-xl"
        title="Sticky top horizontal scroll bar — drag or scroll horizontally to move table left/right from anywhere on page"
      >
        <div className="flex items-center space-x-2 shrink-0 mr-3">
          <span className="text-indigo-400 font-bold uppercase tracking-wider">◄ HORIZONTAL SCROLL BAR ►</span>
          <span className="text-zinc-500 text-[9px] font-sans hidden sm:inline">(Scroll left/right to view all columns)</span>
        </div>
        <div className="w-[1300px] h-2 bg-gradient-to-r from-indigo-500/40 via-emerald-500/50 to-indigo-500/40 rounded-full shrink-0"></div>
      </div>

      <div ref={tableScrollRef} onScroll={handleTableScroll} className="overflow-x-auto rounded-b-xl">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-[#0A0A0B] text-zinc-400 text-[11px] font-mono border-b border-zinc-800 uppercase tracking-wider">
              <th className="py-3 px-3 w-12 text-center">#</th>

              {/* ATS Score Header */}
              <th 
                onClick={() => onSortChange('atsScore')}
                className="py-3 px-3 cursor-pointer hover:bg-zinc-800/60 transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>ATS Match</span>
                  {getSortIcon('atsScore')}
                </div>
              </th>

              {/* Company & Stability Header */}
              <th 
                onClick={() => onSortChange('company')}
                className="py-3 px-3 cursor-pointer hover:bg-zinc-800/60 transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Company & Signals</span>
                  {getSortIcon('company')}
                </div>
              </th>

              {/* Role Title & Location Header */}
              <th 
                onClick={() => onSortChange('title')}
                className="py-3 px-3 cursor-pointer hover:bg-zinc-800/60 transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Role & Discovered</span>
                  {getSortIcon('title')}
                </div>
              </th>

              {/* Selected Resume Header */}
              <th 
                onClick={() => onSortChange('matchedResumeName')}
                className="py-3 px-3 cursor-pointer hover:bg-zinc-800/60 transition-colors select-none min-w-[140px]"
              >
                <div className="flex items-center space-x-1">
                  <span>Matched Résumé</span>
                  {getSortIcon('matchedResumeName')}
                </div>
              </th>

              {/* Hiring Manager Contact Column */}
              <th className="py-3 px-3 min-w-[200px]">
                <div className="flex items-center space-x-1 text-zinc-300">
                  <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Hiring Manager / Tech Lead</span>
                </div>
              </th>

              {/* HR / Recruiter Contact Column */}
              <th className="py-3 px-3 min-w-[200px]">
                <div className="flex items-center space-x-1 text-emerald-400">
                  <User className="h-3.5 w-3.5 text-emerald-500" />
                  <span>HR Manager / Recruiter</span>
                </div>
              </th>

              {/* Application Status Header */}
              <th 
                onClick={() => onSortChange('status')}
                className="py-3 px-3 cursor-pointer hover:bg-zinc-800/60 transition-colors select-none min-w-[120px]"
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>

              {/* Actions Column */}
              <th className="py-3 px-3 text-right min-w-[160px]">Outreach Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-xs font-sans">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ShieldAlert className="h-8 w-8 text-zinc-600" />
                    <p className="text-sm font-medium text-zinc-400">No job opportunities match current filter parameters.</p>
                    <p className="text-xs text-zinc-500">Try adjusting your search query, location, or ATS score slider.</p>
                  </div>
                </td>
              </tr>
            ) : (
              jobs.map((job, idx) => {
                const hiringContact = job.contacts?.find(c => c.contactType === 'HIRING');
                const hrContact = job.contacts?.find(c => c.contactType === 'HR');
                const isPenalized = job.atsAnalysis?.mandatorySkillPenalty && job.atsAnalysis.mandatorySkillPenalty > 0;

                return (
                  <tr 
                    key={job.id} 
                    className={`hover:bg-zinc-800/40 transition-colors ${
                      job.atsScore >= 80 ? 'bg-[#111113]' : 'bg-[#0A0A0B]/60'
                    }`}
                  >
                    {/* # Index */}
                    <td className="py-3 px-3 text-center text-zinc-500 font-mono text-[11px] font-medium">
                      {idx + 1}
                    </td>

                    {/* ATS Score Badge */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onOpenAtsModal(job)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-transform active:scale-95 border ${
                          job.atsScore >= 85
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : job.atsScore >= 75
                            ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Click to view full ATS score breakdown & component analysis"
                      >
                        <span>{job.atsScore}</span>
                        {isPenalized && (
                          <AlertTriangle className="h-3 w-3 text-rose-400 animate-pulse" title="Mandatory Skill Mismatch Penalty Applied" />
                        )}
                      </button>
                    </td>

                    {/* Company & Stability */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-zinc-100 flex items-center space-x-1.5">
                        <a 
                          href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(job.company.split('(')[0].trim())}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hover:text-indigo-300 hover:underline inline-flex items-center space-x-1 text-zinc-100"
                          title={`View official company page for ${job.company}`}
                        >
                          <span>{job.company}</span>
                          <ExternalLink className="h-3 w-3 text-zinc-500 inline-block shrink-0" />
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className="px-1.5 py-0.2 text-[10px] font-mono bg-zinc-900 text-zinc-400 rounded border border-zinc-800">
                          {job.companyClassification}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate max-w-[180px]" title={job.stabilitySignal}>
                          {job.stabilitySignal}
                        </span>
                      </div>
                    </td>

                    {/* Role Title, Location & Source */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-zinc-100">
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-indigo-300 hover:underline inline-flex items-center space-x-1.5"
                          title={`Navigate to source listing for ${job.title} on ${job.source}`}
                        >
                          <span className="text-zinc-100 font-semibold">{job.title}</span>
                          <ExternalLink className="h-3 w-3 text-indigo-400 shrink-0" />
                        </a>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-emerald-400 font-medium">{job.location}</span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-zinc-400">{job.source}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Posted: {formatIST(job.postedAt)}
                      </div>
                    </td>

                    {/* Matched Resume */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-zinc-300 font-medium">
                          <FileText className="h-3 w-3 text-zinc-400" />
                          <span className="truncate max-w-[130px]">{job.matchedResumeName.replace('.pdf', '')}</span>
                        </span>
                        <button
                          onClick={() => onDownloadResume(job.matchedResumeName)}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 underline text-left flex items-center space-x-1 font-mono"
                        >
                          <span>View Variant</span>
                        </button>
                      </div>
                    </td>

                    {/* Hiring Manager Contact */}
                    <td className="py-3 px-3">
                      {hiringContact ? (
                        <div className="space-y-1">
                          <div className="font-medium text-zinc-200 flex items-center justify-between gap-1">
                            <span className="truncate max-w-[130px]">{hiringContact.name}</span>
                            <a 
                              href={hiringContact.linkedinUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 p-0.5 bg-zinc-900 rounded border border-zinc-800 flex items-center space-x-1 px-1 shrink-0"
                              title="Open verified profile search on LinkedIn"
                            >
                              <Linkedin className="h-3 w-3" />
                              <span className="text-[9px] font-mono">Profile</span>
                            </a>
                          </div>

                          {/* Network Degree & Mutual Connection Link */}
                          <div className="flex flex-col space-y-0.5">
                            {hiringContact.connectionDegree === '1st' ? (
                              <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <span>🟢 1st Connection</span>
                              </span>
                            ) : (
                              <div className="flex flex-col">
                                <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                  <span>🔵 2nd Connection</span>
                                </span>
                                {hiringContact.mutualConnectionName && (
                                  <a 
                                    href={hiringContact.mutualConnectionLinkedinUrl || hiringContact.linkedinUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] text-sky-400 hover:text-sky-300 hover:underline font-mono truncate max-w-[170px] mt-0.5"
                                    title={`Request warm intro via mutual connection: ${hiringContact.mutualConnectionName}`}
                                  >
                                    Intro via: <strong>{hiringContact.mutualConnectionName}</strong>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">{hiringContact.title}</div>
                          
                          {hiringContact.email && (
                            <div className="flex items-center space-x-1 text-[10px] text-zinc-300 font-mono bg-[#0A0A0B] px-1.5 py-0.5 rounded border border-zinc-800">
                              <Mail className="h-2.5 w-2.5 text-zinc-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{hiringContact.email}</span>
                              <button
                                onClick={() => copyToClipboard(hiringContact.email!)}
                                className="text-zinc-500 hover:text-zinc-200"
                                title="Copy email address"
                              >
                                {copiedEmail === hiringContact.email ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}

                          {hiringContact.phone && (
                            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-[#0A0A0B] px-1.5 py-0.5 rounded border border-emerald-900/50">
                              <Phone className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{hiringContact.phone}</span>
                              <button
                                onClick={() => copyToClipboard(hiringContact.phone!)}
                                className="text-zinc-500 hover:text-emerald-300"
                                title="Copy direct contact number"
                              >
                                {copiedEmail === hiringContact.phone ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-600 italic">Direct profile not verified</span>
                      )}
                    </td>

                    {/* HR / Recruiter Contact */}
                    <td className="py-3 px-3">
                      {hrContact ? (
                        <div className="space-y-1">
                          <div className="font-medium text-zinc-200 flex items-center justify-between gap-1">
                            <span className="truncate max-w-[130px]">{hrContact.name}</span>
                            <a 
                              href={hrContact.linkedinUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 p-0.5 bg-zinc-900 rounded border border-zinc-800 flex items-center space-x-1 px-1 shrink-0"
                              title="Open verified profile search on LinkedIn"
                            >
                              <Linkedin className="h-3 w-3" />
                              <span className="text-[9px] font-mono">Profile</span>
                            </a>
                          </div>

                          {/* Network Degree & Mutual Connection Link */}
                          <div className="flex flex-col space-y-0.5">
                            {hrContact.connectionDegree === '1st' ? (
                              <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <span>🟢 1st Connection</span>
                              </span>
                            ) : (
                              <div className="flex flex-col">
                                <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                  <span>🔵 2nd Connection</span>
                                </span>
                                {hrContact.mutualConnectionName && (
                                  <a 
                                    href={hrContact.mutualConnectionLinkedinUrl || hrContact.linkedinUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] text-sky-400 hover:text-sky-300 hover:underline font-mono truncate max-w-[170px] mt-0.5"
                                    title={`Request warm intro via mutual connection: ${hrContact.mutualConnectionName}`}
                                  >
                                    Intro via: <strong>{hrContact.mutualConnectionName}</strong>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">{hrContact.title}</div>
                          
                          {hrContact.email && (
                            <div className="flex items-center space-x-1 text-[10px] text-zinc-300 font-mono bg-[#0A0A0B] px-1.5 py-0.5 rounded border border-zinc-800">
                              <Mail className="h-2.5 w-2.5 text-zinc-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{hrContact.email}</span>
                              <button
                                onClick={() => copyToClipboard(hrContact.email!)}
                                className="text-zinc-500 hover:text-zinc-200"
                                title="Copy email address"
                              >
                                {copiedEmail === hrContact.email ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}

                          {hrContact.phone && (
                            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-[#0A0A0B] px-1.5 py-0.5 rounded border border-emerald-900/50">
                              <Phone className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{hrContact.phone}</span>
                              <button
                                onClick={() => copyToClipboard(hrContact.phone!)}
                                className="text-zinc-500 hover:text-emerald-300"
                                title="Copy direct contact number"
                              >
                                {copiedEmail === hrContact.phone ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-600 italic">Direct profile not verified</span>
                      )}
                    </td>

                    {/* Application Status */}
                    <td className="py-3 px-3">
                      <select
                        value={job.status}
                        onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
                        className={`px-2 py-1 rounded text-xs font-medium focus:outline-none border ${
                          job.status === 'Drafted'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : job.status === 'Applied'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : job.status === 'Replied'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : job.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                        }`}
                      >
                        <option value="New" className="bg-zinc-900 text-zinc-200">New</option>
                        <option value="Drafted" className="bg-zinc-900 text-amber-400">Drafted</option>
                        <option value="Applied" className="bg-zinc-900 text-emerald-400">Applied</option>
                        <option value="Replied" className="bg-zinc-900 text-purple-400">Replied</option>
                        <option value="Rejected" className="bg-zinc-900 text-rose-400">Rejected</option>
                      </select>
                    </td>

                    {/* Outreach Actions Column */}
                    <td className="py-3 px-3 text-right">
                      {isDeletedView ? (
                        <button
                          onClick={() => onRestore(job.id)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 rounded text-xs transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Restore</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* ATS Analysis Criteria Icon Button */}
                          <button
                            onClick={() => onOpenAtsModal(job)}
                            className="p-1.5 bg-zinc-900 hover:bg-indigo-950 text-indigo-400 hover:text-indigo-300 rounded-lg border border-zinc-800 hover:border-indigo-700/60 transition-colors cursor-pointer"
                            title="View ATS Criteria Analysis, Matching/Missing Keywords & Tailor Résumé"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                          </button>

                          {/* Direct Gmail Compose Icon Button */}
                          <button
                            onClick={() => onPrepareGmailDraft(job)}
                            className="p-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                            title="Open Gmail Compose directly with pre-filled details & download role-matched PDF résumé"
                          >
                            <Mail className="h-3.5 w-3.5 text-zinc-950 shrink-0" />
                          </button>

                          {/* Soft Delete Action Icon Button */}
                          <button
                            onClick={() => onSoftDelete(job.id)}
                            className="p-1.5 bg-zinc-900 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 rounded-lg border border-zinc-800 hover:border-rose-800 transition-colors cursor-pointer"
                            title="Soft delete job (preserves contacts and history)"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
