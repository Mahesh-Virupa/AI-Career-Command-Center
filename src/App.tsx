import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MovingTicker } from './components/MovingTicker';
import { KpiCards } from './components/KpiCards';
import { FilterBar } from './components/FilterBar';
import { JobGridTable } from './components/JobGridTable';
import { AtsBreakdownModal } from './components/AtsBreakdownModal';
import { GmailDraftModal } from './components/GmailDraftModal';
import { ResumeVaultModal } from './components/ResumeVaultModal';
import { AgentLogsModal } from './components/AgentLogsModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { MAHESH_PROFILE } from './data/candidate';
import { AgentRun, ApplicationLog, FilterState, Job, JobStatus, OutreachDraft, SortState } from './types';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([]);
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState<boolean>(false);

  // Modal States
  const [selectedAtsJob, setSelectedAtsJob] = useState<Job | null>(null);
  const [createdDraft, setCreatedDraft] = useState<{ job: Job; draft: OutreachDraft } | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    location: 'all',
    roleType: 'all',
    companyType: 'all',
    status: 'all',
    minAtsScore: 80, // Default to filtering out jobs with score < 80
    showDeleted: false,
    resumeType: 'all',
    hasVerifiedContacts: 'all'
  });

  // Sort State
  const [sortState, setSortState] = useState<SortState>({
    column: 'atsScore',
    direction: 'desc'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Jobs & Logs from API
  const fetchJobsAndLogs = async () => {
    try {
      const showDeletedParam = filters.showDeleted ? 'true' : 'false';
      const [jobsRes, runsRes] = await Promise.all([
        fetch(`/api/jobs?showDeleted=${showDeletedParam}`),
        fetch('/api/agent-runs')
      ]);

      const jobsData = await jobsRes.json();
      const runsData = await runsRes.json();

      if (jobsData.success) {
        setJobs(jobsData.data || []);
      }
      if (runsData.success) {
        setAgentRuns(runsData.data || []);
        setLogs(runsData.logs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndLogs();
  }, [filters.showDeleted]);

  // Handle Sort Toggle
  const handleSortChange = (column: SortState['column']) => {
    setSortState(prev => {
      if (prev.column === column) {
        return { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { column, direction: 'desc' };
    });
  };

  // Filter & Sort Logic
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.source.toLowerCase().includes(q) ||
        j.matchedResumeName.toLowerCase().includes(q)
      );
    }

    // Location Filter
    if (filters.location !== 'all') {
      const locFilter = filters.location.toLowerCase();
      if (locFilter === 'india remote') {
        result = result.filter(j => j.location.toLowerCase().includes('remote'));
      } else if (locFilter === 'global remote') {
        result = result.filter(j => j.location.toLowerCase().includes('global remote') || j.location.toLowerCase().includes('global'));
      } else {
        result = result.filter(j => j.location.toLowerCase().includes(locFilter));
      }
    }

    // Company Type Filter
    if (filters.companyType !== 'all') {
      result = result.filter(j => j.companyClassification === filters.companyType);
    }

    // Status Filter
    if (filters.status !== 'all') {
      result = result.filter(j => j.status === filters.status);
    }

    // Min ATS Score Filter: Filter out jobs where score is less than 80 by default!
    if (filters.minAtsScore > 0) {
      if (filters.minAtsScore === 1) {
        // Show low match (<80)
        result = result.filter(j => j.atsScore < 80);
      } else {
        result = result.filter(j => j.atsScore >= filters.minAtsScore);
      }
    } else {
      // Default: Strictly filter out jobs with score < 80
      result = result.filter(j => j.atsScore >= 80);
    }

    // Calendar Date Range Filter
    if (filters.startDate) {
      const startMs = new Date(filters.startDate).getTime();
      result = result.filter(j => {
        const postedMs = new Date(j.postedAt).getTime();
        const discMs = new Date(j.discoveredAt).getTime();
        return postedMs >= startMs || discMs >= startMs;
      });
    }

    if (filters.endDate) {
      const endMs = new Date(`${filters.endDate}T23:59:59.999`).getTime();
      result = result.filter(j => {
        const postedMs = new Date(j.postedAt).getTime();
        const discMs = new Date(j.discoveredAt).getTime();
        return postedMs <= endMs || discMs <= endMs;
      });
    }

    // Sorting Logic
    result.sort((a, b) => {
      let valA: any = a[sortState.column];
      let valB: any = b[sortState.column];

      if (sortState.column === 'postedAt' || sortState.column === 'discoveredAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [jobs, filters, sortState]);

  // Execute Multi-Agent Pipeline
  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      const res = await fetch('/api/agents/run-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Multi-Agent Pipeline executed! Scout, ATS Analyst & Outreach completed.');
        await fetchJobsAndLogs();
      } else {
        showToast('Pipeline Error: ' + data.error);
      }
    } catch (err: any) {
      showToast('Error executing agents: ' + err.message);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  // Prepare & Directly Launch Gmail Compose with Contacts, Subject & Body
  const handlePrepareGmailDraft = async (job: Job) => {
    try {
      const res = await fetch(`/api/jobs/${job.id}/gmail-draft`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const draft = data.data.draft;
        
        // Open Gmail Compose directly in new tab with pre-filled To, Subject, and Body (no modal popup, no pdf download)
        const recipientsList = draft.recipients.map((r: string) => {
          const match = r.match(/<([^>]+)>/);
          return match ? match[1] : r;
        }).join(',');
        const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientsList)}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.bodyText)}`;
        window.open(composeUrl, '_blank', 'noopener,noreferrer');

        showToast(`🚀 Gmail Compose opened for ${job.company}!`);
        await fetchJobsAndLogs();
      } else {
        showToast(`Error: ${data.error}`);
      }
    } catch (err: any) {
      showToast(`Draft Creation Failed: ${err.message}`);
    }
  };

  // Tailor Resume Action
  const handleTailorResume = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/tailor-resume`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`⚡ Résumé tailored for ${data.data.company}! ATS Match score boosted to 96%.`);
        await fetchJobsAndLogs();
      }
    } catch (err: any) {
      showToast(`Tailor failed: ${err.message}`);
    }
  };

  // Status Update
  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Application status updated to '${newStatus}'`);
        await fetchJobsAndLogs();
      }
    } catch (err: any) {
      showToast(`Status update failed: ${err.message}`);
    }
  };

  // Soft Delete Job
  const handleSoftDelete = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'User marked soft delete' })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Job soft-deleted (moved to Deleted Jobs view, history preserved)');
        await fetchJobsAndLogs();
      }
    } catch (err: any) {
      showToast(`Soft delete failed: ${err.message}`);
    }
  };

  // Restore Soft-Deleted Job
  const handleRestore = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/restore`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Job restored to active dashboard tracker');
        await fetchJobsAndLogs();
      }
    } catch (err: any) {
      showToast(`Restore failed: ${err.message}`);
    }
  };

  // Download Resume PDF
  const handleDownloadResume = (fileName: string) => {
    window.open(`/api/resumes/${encodeURIComponent(fileName)}/download`, '_blank');
  };

  // Dispatch Test WhatsApp Alert directly to user's phone via WhatsApp Web/App
  const handleSendTestWhatsApp = async () => {
    setIsSendingWhatsApp(true);
    try {
      const active = jobs.filter(j => !j.deletedAt);
      const highMatches = active.filter(j => j.atsScore >= 80);

      let waText = `📱 *AI CAREER COMMAND CENTER — DAILY REPORT*\n`;
      waText += `*Candidate:* Mahesh V (+91 98865 49126)\n`;
      waText += `------------------------------------\n`;
      waText += `• Total Jobs Discovered: ${active.length}\n`;
      waText += `• High ATS Matches (≥80): ${highMatches.length}\n`;
      waText += `------------------------------------\n`;
      waText += `*Top Priority Opportunities:*\n`;

      highMatches.slice(0, 5).forEach((j, i) => {
        waText += `${i + 1}. *${j.title}* at *${j.company}*\n   ATS Score: ${j.atsScore} | Location: ${j.location}\n`;
      });

      waText += `\nDirect Dashboard: ${window.location.origin}`;

      // Open WhatsApp direct message link to user's WhatsApp number +91 9886549126
      const waUrl = `https://api.whatsapp.com/send?phone=919886549126&text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Call API log
      await fetch('/api/notifications/whatsapp', { method: 'POST' });
      showToast('🚀 WhatsApp opened with your prefilled daily job digest for +91 9886549126!');
    } catch (err: any) {
      showToast('WhatsApp dispatch failed: ' + err.message);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const totalActiveCount = jobs.filter(j => !j.deletedAt).length;
  const totalDeletedCount = jobs.filter(j => j.deletedAt).length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans antialiased selection:bg-zinc-700 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-zinc-700 text-zinc-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center space-x-2 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        profile={MAHESH_PROFILE}
        onRunPipeline={handleRunPipeline}
        onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
        onOpenResumes={() => setIsResumeModalOpen(true)}
        onOpenLogs={() => setIsLogsModalOpen(true)}
        isRunningPipeline={isRunningPipeline}
        lastRunTime={agentRuns[0]?.startedAt}
      />

      {/* Moving Live Crawler Ticker at Top */}
      <MovingTicker onTriggerLiveCrawl={handleRunPipeline} isCrawling={isRunningPipeline} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* KPI Summary Cards */}
        <KpiCards jobs={jobs} />

        {/* Filter Controls Toolbar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters({
            searchQuery: '',
            location: 'all',
            roleType: 'all',
            companyType: 'all',
            status: 'all',
            minAtsScore: 80,
            showDeleted: false,
            resumeType: 'all',
            hasVerifiedContacts: 'all',
            startDate: '',
            endDate: ''
          })}
          totalActiveCount={totalActiveCount}
          totalDeletedCount={totalDeletedCount}
        />

        {/* Main Job Grid Table */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="inline-block animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-xs font-mono">Initializing AI Career Command Center store...</p>
          </div>
        ) : (
          <JobGridTable
            jobs={filteredAndSortedJobs}
            sortState={sortState}
            onSortChange={handleSortChange}
            onOpenAtsModal={setSelectedAtsJob}
            onPrepareGmailDraft={handlePrepareGmailDraft}
            onStatusChange={handleStatusChange}
            onSoftDelete={handleSoftDelete}
            onRestore={handleRestore}
            onDownloadResume={handleDownloadResume}
            isDeletedView={filters.showDeleted}
          />
        )}

      </main>

      {/* Modals */}
      {selectedAtsJob && (
        <AtsBreakdownModal
          job={selectedAtsJob}
          onClose={() => setSelectedAtsJob(null)}
          onDownloadResume={handleDownloadResume}
          onTailorResume={handleTailorResume}
        />
      )}

      {createdDraft && (
        <GmailDraftModal
          job={createdDraft.job}
          draft={createdDraft.draft}
          onClose={() => setCreatedDraft(null)}
          onDownloadResume={handleDownloadResume}
        />
      )}

      {isResumeModalOpen && (
        <ResumeVaultModal
          onClose={() => setIsResumeModalOpen(false)}
          onDownloadResume={handleDownloadResume}
          onResumesUpdated={fetchJobsAndLogs}
        />
      )}

      {isLogsModalOpen && (
        <AgentLogsModal
          agentRuns={agentRuns}
          logs={logs}
          onClose={() => setIsLogsModalOpen(false)}
        />
      )}

      {isWhatsAppModalOpen && (
        <WhatsAppModal
          jobs={jobs}
          onClose={() => setIsWhatsAppModalOpen(false)}
          onSendTestNotification={handleSendTestWhatsApp}
          isSending={isSendingWhatsApp}
        />
      )}

    </div>
  );
}
