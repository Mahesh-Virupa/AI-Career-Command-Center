import React from 'react';
import { Briefcase, CheckCircle, Mail, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import { Job } from '../types';

interface KpiCardsProps {
  jobs: Job[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ jobs }) => {
  const activeJobs = jobs.filter(j => !j.deletedAt);
  const highAtsMatches = activeJobs.filter(j => j.atsScore >= 80);
  
  const verifiedContactsCount = activeJobs.reduce((acc, job) => {
    return acc + (job.contacts?.filter(c => c.confidence === 'VERIFIED').length || 0);
  }, 0);

  const gmailDraftsCount = activeJobs.filter(j => j.status === 'Drafted' || j.gmailDraftId).length;
  const appliedCount = activeJobs.filter(j => j.status === 'Applied').length;
  const repliedCount = activeJobs.filter(j => j.status === 'Replied').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-5">
      
      {/* 1. Active Openings */}
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between text-zinc-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">New Jobs (24h)</span>
          <div className="p-1 bg-zinc-900 rounded text-zinc-400">
            <Briefcase className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-zinc-100 font-mono">{activeJobs.length}</span>
          <span className="text-[10px] font-mono text-emerald-500">+12%</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 flex items-center font-mono">
          <span>Active Scouted</span>
        </div>
      </div>

      {/* 2. High ATS Matches (>=80) */}
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between text-zinc-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">High ATS (&ge;80)</span>
          <div className="p-1 bg-emerald-500/10 rounded text-emerald-500">
            <Star className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-zinc-100 font-mono">{highAtsMatches.length}</span>
          <span className="text-[10px] font-mono text-emerald-500">Verified</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 flex items-center font-mono">
          <span>Top Matches</span>
        </div>
      </div>

      {/* 3. Verified Contact Profiles */}
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between text-zinc-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Contacts Found</span>
          <div className="p-1 bg-zinc-900 rounded text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-zinc-100 font-mono">{verifiedContactsCount}</span>
          <span className="text-[10px] font-mono text-zinc-400">Verified</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 flex items-center font-mono">
          <span>Hiring & HR Leads</span>
        </div>
      </div>

      {/* 4. Gmail Drafts Created */}
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between text-zinc-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Gmail Drafts</span>
          <div className="p-1 bg-amber-500/10 rounded text-amber-500">
            <Mail className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-zinc-100 font-mono">{gmailDraftsCount}</span>
          <span className="text-[10px] font-mono text-amber-500">Pending</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 flex items-center font-mono">
          <span>PDF Attached</span>
        </div>
      </div>

      {/* 5. Applied Jobs */}
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between text-zinc-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Applied</span>
          <div className="p-1 bg-zinc-900 rounded text-zinc-400">
            <CheckCircle className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-zinc-100 font-mono">{appliedCount}</span>
          <span className="text-[10px] font-mono text-zinc-400">Dispatched</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 flex items-center font-mono">
          <span>Outreach Sent</span>
        </div>
      </div>

      {/* 6. Replies Received */}
      <div className="bg-[#111113] border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between text-zinc-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Replies</span>
          <div className="p-1 bg-zinc-900 rounded text-zinc-400">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-light text-zinc-100 font-mono">{repliedCount}</span>
          <span className="text-[10px] font-mono text-emerald-500">Scheduled</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 flex items-center font-mono">
          <span>Interviews</span>
        </div>
      </div>

    </div>
  );
};
