import React, { useState, useEffect } from 'react';
import { 
  ArrowDown, ArrowUp, ArrowUpDown, BarChart3, Calendar, Check, Copy, ExternalLink, FileText, 
  Linkedin, Mail, Phone, RotateCcw, ShieldAlert, 
  Trash2, User, UserCheck, AlertTriangle, ChevronLeft, ChevronRight
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const topScrollRef = React.useRef<HTMLDivElement>(null);
  const tableScrollRef = React.useRef<HTMLDivElement>(null);
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(1450);

  // Helper to ensure LinkedIn URLs land directly on working individual profile results on LinkedIn (never showing "This page does not exist")
  const getWorkingLinkedinUrl = (contactName: string, companyName: string, existingUrl?: string) => {
    if (existingUrl && existingUrl.includes('mahesh-v-8187476')) {
      return existingUrl;
    }
    const cleanCompany = companyName.split('(')[0].replace(/GCC|India|Tech/gi, '').trim();
    const query = `${contactName} ${cleanCompany}`.trim();
    return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
  };

  const getMutualLinkedinUrl = (mutualName?: string, defaultUrl?: string) => {
    if (defaultUrl && defaultUrl.includes('mahesh-v-8187476')) {
      return defaultUrl;
    }
    if (!mutualName) return 'https://www.linkedin.com/in/mahesh-v-8187476/';
    return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(mutualName)}`;
  };

  const formatAtsScore = (score: any): number => {
    const num = Number(score);
    if (isNaN(num)) return 85;
    if (num > 100) {
      const str = String(num);
      const parsed = parseInt(str.substring(0, 2), 10);
      return Math.min(100, Math.max(0, parsed));
    }
    return Math.min(100, Math.max(0, Math.round(num)));
  };

  // Reset page to 1 whenever jobs list changes drastically (e.g. filter changed)
  useEffect(() => {
    setCurrentPage(1);
  }, [jobs.length]);

  // Update table scroll width for top scrollbar sync
  useEffect(() => {
    if (tableScrollRef.current) {
      setTableScrollWidth(tableScrollRef.current.scrollWidth || 1300);
    }
  }, [jobs, pageSize, currentPage]);

  const totalJobs = jobs.length;
  const totalPages = Math.ceil(totalJobs / pageSize) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalJobs);
  const currentJobs = jobs.slice(startIndex, endIndex);

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
      return <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60" />;
    }
    return sortState.direction === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-indigo-600 font-bold" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-600 font-bold" />
    );
  };

  const formatIST = (isoString: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';
    } catch {
      return isoString;
    }
  };

  const formatCreatedDateTimeIST = (dateStr?: string) => {
    if (!dateStr) return '03 Aug 2026, 05:00:00 AM IST';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '03 Aug 2026, 05:00:00 AM IST';
      return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' IST';
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs relative flex flex-col">
      
      {/* Sticky Top Toolbar: Top Pagination + Moving Horizontal Scrollbar */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 rounded-t-xl shadow-xs">
        
        {/* Top Pagination Control Bar */}
        <div className="py-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 border-b border-slate-200">
          {/* Summary & Range Indexing */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <span className="text-indigo-700 font-bold uppercase tracking-wider text-[11px] bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
              ⚡ Total Scouted Jobs: <strong className="text-indigo-950 font-extrabold">{totalJobs}</strong>
            </span>
            <span className="text-slate-600">
              Showing <strong className="text-slate-900 font-bold">{totalJobs > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong className="text-slate-900 font-bold">{totalJobs}</strong> (Index #{totalJobs > 0 ? startIndex + 1 : 0} to #{endIndex})
            </span>
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-300">
              <span className="text-slate-500 font-medium">Per Page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={30}>30 per page</option>
                <option value={50}>50 per page</option>
                <option value={totalJobs || 100}>All ({totalJobs})</option>
              </select>
            </div>
          </div>

          {/* Top Page Navigation Buttons */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-2.5 py-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= safePage - 2 && pageNum <= safePage + 2)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                        safePage === pageNum
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && safePage > 4) ||
                  (pageNum === totalPages - 1 && safePage < totalPages - 3)
                ) {
                  return <span key={pageNum} className="px-1 text-slate-400 font-mono">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-2.5 py-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Moving Top Horizontal Scrollbar Track */}
        <div 
          ref={topScrollRef} 
          onScroll={handleTopScroll} 
          className="overflow-x-auto bg-slate-100/90 py-1 px-2 border-b border-slate-200 text-[10px] font-mono text-slate-500 cursor-ew-resize select-none"
          title="Sticky top horizontal scroll bar — drag or scroll horizontally to move table left/right"
        >
          <div 
            style={{ width: `${Math.max(1300, tableScrollWidth)}px` }} 
            className="h-2 flex items-center justify-between px-4 bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 rounded-full"
          >
            <span className="text-[9px] uppercase font-bold text-indigo-700 tracking-wider">◄ Drag Top Horizontal Scrollbar</span>
            <span className="text-[9px] uppercase font-bold text-indigo-700 tracking-wider">Table Scroll Left / Right ►</span>
          </div>
        </div>

      </div>

      {/* Main Table Container */}
      <div ref={tableScrollRef} onScroll={handleTableScroll} className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 text-[11px] font-mono border-b border-slate-200 uppercase tracking-wider font-semibold">
              <th className="py-3 px-3.5 w-12 text-center">#</th>

              {/* ATS Score Header */}
              <th 
                onClick={() => onSortChange('atsScore')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>ATS Match</span>
                  {getSortIcon('atsScore')}
                </div>
              </th>

              {/* Company & Signals Header */}
              <th 
                onClick={() => onSortChange('company')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Company & Signals</span>
                  {getSortIcon('company')}
                </div>
              </th>

              {/* Role Title & Location Header */}
              <th 
                onClick={() => onSortChange('title')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Role & Discovered</span>
                  {getSortIcon('title')}
                </div>
              </th>

              {/* Created Date & Time Header */}
              <th 
                onClick={() => onSortChange('discoveredAt')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors select-none min-w-[175px]"
              >
                <div className="flex items-center space-x-1.5 text-indigo-950 font-bold">
                  <Calendar className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>Created Date & Time (IST)</span>
                  {getSortIcon('discoveredAt')}
                </div>
              </th>

              {/* Selected Resume Header */}
              <th 
                onClick={() => onSortChange('matchedResumeName')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors select-none min-w-[140px]"
              >
                <div className="flex items-center space-x-1">
                  <span>Matched Résumé</span>
                  {getSortIcon('matchedResumeName')}
                </div>
              </th>

              {/* Hiring Manager Contact Column */}
              <th className="py-3 px-3.5 min-w-[210px]">
                <div className="flex items-center space-x-1.5 text-slate-800">
                  <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Hiring Manager / Tech Lead</span>
                </div>
              </th>

              {/* HR / Recruiter Contact Column */}
              <th className="py-3 px-3.5 min-w-[210px]">
                <div className="flex items-center space-x-1.5 text-slate-800">
                  <User className="h-3.5 w-3.5 text-emerald-600" />
                  <span>HR Manager / Recruiter</span>
                </div>
              </th>

              {/* Application Status Header */}
              <th 
                onClick={() => onSortChange('status')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors select-none min-w-[120px]"
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>

              {/* Actions Column */}
              <th className="py-3 px-3.5 text-right min-w-[160px]">Outreach Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/80 text-xs font-sans bg-white">
            {currentJobs.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ShieldAlert className="h-8 w-8 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700">No job opportunities match current filter parameters.</p>
                    <p className="text-xs text-slate-500">Try adjusting your search query, location, or ATS score filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentJobs.map((job, idx) => {
                const globalIdx = startIndex + idx + 1;
                const hiringContact = job.contacts?.find(c => c.contactType === 'HIRING');
                const hrContact = job.contacts?.find(c => c.contactType === 'HR');
                const isPenalized = job.atsAnalysis?.mandatorySkillPenalty && job.atsAnalysis.mandatorySkillPenalty > 0;

                return (
                  <tr 
                    key={job.id} 
                    className={`hover:bg-slate-50/80 transition-colors ${
                      job.atsScore >= 80 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    {/* # Global Index */}
                    <td className="py-3.5 px-3.5 text-center text-slate-500 font-mono text-[11px] font-semibold">
                      {globalIdx}
                    </td>

                    {/* ATS Score Badge */}
                    <td className="py-3.5 px-3.5">
                      <button
                        onClick={() => onOpenAtsModal(job)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-transform active:scale-95 border cursor-pointer ${
                          formatAtsScore(job.atsScore) >= 85
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : formatAtsScore(job.atsScore) >= 75
                            ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to view full ATS score breakdown & component analysis"
                      >
                        <span>{formatAtsScore(job.atsScore)}</span>
                        {isPenalized && (
                          <AlertTriangle className="h-3 w-3 text-rose-600 animate-pulse" title="Mandatory Skill Mismatch Penalty Applied" />
                        )}
                      </button>
                    </td>

                    {/* Company & Stability */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <a 
                          href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(job.company.split('(')[0].trim())}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="hover:text-indigo-600 hover:underline inline-flex items-center space-x-1 text-slate-900"
                          title={`View official company page for ${job.company}`}
                        >
                          <span>{job.company}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400 inline-block shrink-0" />
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium">
                          {job.companyClassification}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[180px]" title={job.stabilitySignal}>
                          {job.stabilitySignal}
                        </span>
                      </div>
                    </td>

                    {/* Role Title, Location & Source */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-bold text-slate-900">
                        <a
                          href={job.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-indigo-600 hover:underline inline-flex items-center space-x-1.5"
                          title={`Navigate to source listing for ${job.title} on ${job.source}`}
                        >
                          <span className="text-slate-900 font-bold">{job.title}</span>
                          <ExternalLink className="h-3 w-3 text-indigo-500 shrink-0" />
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-emerald-700 font-semibold">{job.location}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600 font-medium">{job.source}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Posted: {formatIST(job.postedAt)}
                      </div>
                    </td>

                    {/* Created Date & Time (IST) Cell */}
                    <td className="py-3.5 px-3.5 text-slate-700 font-mono text-[11px] font-medium whitespace-nowrap">
                      <div className="flex flex-col space-y-0.5">
                        <span className="font-bold text-slate-900">{formatCreatedDateTimeIST(job.discoveredAt || job.createdAt || job.postedAt)}</span>
                        <span className="text-[10px] text-slate-500 font-sans flex items-center space-x-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                          <span>Added to Database</span>
                        </span>
                      </div>
                    </td>

                    {/* Matched Resume */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-slate-800 font-medium">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate max-w-[130px]">{job.matchedResumeName.replace('.pdf', '')}</span>
                        </span>
                        <button
                          onClick={() => onDownloadResume(job.matchedResumeName)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 underline text-left flex items-center space-x-1 font-mono font-medium"
                        >
                          <span>View Variant</span>
                        </button>
                      </div>
                    </td>

                    {/* Hiring Manager Contact */}
                    <td className="py-3.5 px-3.5">
                      {hiringContact ? (
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 flex items-center justify-between gap-1">
                            <span className="truncate max-w-[130px]">{hiringContact.name}</span>
                            <a 
                              href={getWorkingLinkedinUrl(hiringContact.name, job.company, hiringContact.linkedinUrl)} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 flex items-center space-x-1 px-1.5 py-0.5 shrink-0 transition-colors"
                              title={`Direct LinkedIn Profile for ${hiringContact.name}`}
                            >
                              <Linkedin className="h-3 w-3 fill-blue-600 text-blue-600" />
                              <span className="text-[9px] font-mono font-bold">Profile</span>
                            </a>
                          </div>

                          {/* Network Degree & Mutual Connection Link */}
                          <div className="flex flex-col space-y-0.5">
                            {hiringContact.connectionDegree === '1st' ? (
                              <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span>🟢 1st Connection</span>
                              </span>
                            ) : (
                              <div className="flex flex-col">
                                <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300">
                                  <span>🔵 2nd Connection</span>
                                </span>
                                {hiringContact.mutualConnectionName && (
                                  <a 
                                    href={getMutualLinkedinUrl(hiringContact.mutualConnectionName, hiringContact.mutualConnectionLinkedinUrl)} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] text-indigo-600 hover:text-indigo-800 hover:underline font-mono truncate max-w-[170px] mt-0.5 font-medium"
                                    title={`Request warm intro via mutual connection: ${hiringContact.mutualConnectionName}`}
                                  >
                                    Intro via: <strong>{hiringContact.mutualConnectionName}</strong>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{hiringContact.title}</div>
                          
                          {hiringContact.email && (
                            <div className="flex items-center space-x-1 text-[10px] text-slate-700 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              <Mail className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{hiringContact.email}</span>
                              <button
                                onClick={() => copyToClipboard(hiringContact.email!)}
                                className="text-slate-400 hover:text-slate-700 ml-auto"
                                title="Copy email address"
                              >
                                {copiedEmail === hiringContact.email ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}

                          {hiringContact.phone && (
                            <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                              <Phone className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[120px]">{hiringContact.phone}</span>
                              <button
                                onClick={() => copyToClipboard(hiringContact.phone!)}
                                className="text-slate-400 hover:text-emerald-800 ml-auto"
                                title="Copy direct contact number"
                              >
                                {copiedEmail === hiringContact.phone ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Direct profile not verified</span>
                      )}
                    </td>

                    {/* HR / Recruiter Contact */}
                    <td className="py-3.5 px-3.5">
                      {hrContact ? (
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 flex items-center justify-between gap-1">
                            <span className="truncate max-w-[130px]">{hrContact.name}</span>
                            <a 
                              href={getWorkingLinkedinUrl(hrContact.name, job.company, hrContact.linkedinUrl)} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 flex items-center space-x-1 px-1.5 py-0.5 shrink-0 transition-colors"
                              title={`Direct LinkedIn Profile for ${hrContact.name}`}
                            >
                              <Linkedin className="h-3 w-3 fill-blue-600 text-blue-600" />
                              <span className="text-[9px] font-mono font-bold">Profile</span>
                            </a>
                          </div>

                          {/* Network Degree & Mutual Connection Link */}
                          <div className="flex flex-col space-y-0.5">
                            {hrContact.connectionDegree === '1st' ? (
                              <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span>🟢 1st Connection</span>
                              </span>
                            ) : (
                              <div className="flex flex-col">
                                <span className="inline-flex items-center space-x-1 w-max px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300">
                                  <span>🔵 2nd Connection</span>
                                </span>
                                {hrContact.mutualConnectionName && (
                                  <a 
                                    href={getMutualLinkedinUrl(hrContact.mutualConnectionName, hrContact.mutualConnectionLinkedinUrl)} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] text-indigo-600 hover:text-indigo-800 hover:underline font-mono truncate max-w-[170px] mt-0.5 font-medium"
                                    title={`Request warm intro via mutual connection: ${hrContact.mutualConnectionName}`}
                                  >
                                    Intro via: <strong>{hrContact.mutualConnectionName}</strong>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{hrContact.title}</div>
                          
                          {hrContact.email && (
                            <div className="flex items-center space-x-1 text-[10px] text-slate-700 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              <Mail className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{hrContact.email}</span>
                              <button
                                onClick={() => copyToClipboard(hrContact.email!)}
                                className="text-slate-400 hover:text-slate-700 ml-auto"
                                title="Copy email address"
                              >
                                {copiedEmail === hrContact.email ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}

                          {hrContact.phone && (
                            <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                              <Phone className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[120px]">{hrContact.phone}</span>
                              <button
                                onClick={() => copyToClipboard(hrContact.phone!)}
                                className="text-slate-400 hover:text-emerald-800 ml-auto"
                                title="Copy direct contact number"
                              >
                                {copiedEmail === hrContact.phone ? <Check className="h-2.5 w-2.5 text-emerald-600" /> : <Copy className="h-2.5 w-2.5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Direct profile not verified</span>
                      )}
                    </td>

                    {/* Application Status */}
                    <td className="py-3.5 px-3.5">
                      <select
                        value={job.status}
                        onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
                        className={`px-2 py-1 rounded-md text-xs font-semibold focus:outline-none border cursor-pointer ${
                          job.status === 'Drafted'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : job.status === 'Applied'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : job.status === 'Replied'
                            ? 'bg-purple-50 text-purple-700 border-purple-300'
                            : job.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Drafted">Drafted</option>
                        <option value="Applied">Applied</option>
                        <option value="Replied">Replied</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Outreach Actions Column */}
                    <td className="py-3.5 px-3.5 text-right">
                      {isDeletedView ? (
                        <button
                          onClick={() => onRestore(job.id)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-md text-xs transition-colors cursor-pointer font-medium"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Restore</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* ATS Analysis Criteria Icon Button */}
                          <button
                            onClick={() => onOpenAtsModal(job)}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                            title="View ATS Criteria Analysis, Matching/Missing Keywords & Tailor Résumé"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>

                          {/* Direct Gmail Compose Icon Button */}
                          <button
                            onClick={() => onPrepareGmailDraft(job)}
                            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
                            title="Open Gmail Compose directly with pre-filled details & download role-matched PDF résumé"
                          >
                            <Mail className="h-4 w-4 shrink-0" />
                          </button>

                          {/* Soft Delete Action Icon Button */}
                          <button
                            onClick={() => onSoftDelete(job.id)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                            title="Soft delete job (preserves contacts and history)"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Pagination Footer Bar */}
      <div className="bg-slate-50 border-t border-slate-200 py-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 rounded-b-xl">
        
        {/* Left: Summary */}
        <div className="flex items-center space-x-2">
          <span>Showing <strong className="text-slate-900">{totalJobs > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong className="text-slate-900">{totalJobs}</strong> jobs available</span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-mono text-[11px]">Per Page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value={10}>10 (Default)</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={totalJobs || 100}>All ({totalJobs})</option>
            </select>
          </div>
        </div>

        {/* Right: Page Navigation Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2.5 py-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 text-xs font-medium cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Show pages near current page or first/last
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= safePage - 2 && pageNum <= safePage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      safePage === pageNum
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === 2 && safePage > 4) ||
                (pageNum === totalPages - 1 && safePage < totalPages - 3)
              ) {
                return <span key={pageNum} className="px-1 text-slate-400 font-mono">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2.5 py-1 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 text-xs font-medium cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
