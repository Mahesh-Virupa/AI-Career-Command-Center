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
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-medium">New Jobs (24h)</span>
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
            <Briefcase className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900 font-mono">{activeJobs.length}</span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">+12%</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center font-mono">
          <span>Active Scouted</span>
        </div>
      </div>

      {/* 2. High ATS Matches (>=80) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-medium">High ATS (&ge;80)</span>
          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
            <Star className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900 font-mono">{highAtsMatches.length}</span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">Verified</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center font-mono">
          <span>Top Matches</span>
        </div>
      </div>

      {/* 3. Verified Contact Profiles */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-medium">Contacts Found</span>
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900 font-mono">{verifiedContactsCount}</span>
          <span className="text-[10px] font-mono text-blue-600 font-bold">Verified</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center font-mono">
          <span>Hiring & HR Leads</span>
        </div>
      </div>

      {/* 4. Gmail Drafts Created */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-medium">Gmail Drafts</span>
          <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
            <Mail className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900 font-mono">{gmailDraftsCount}</span>
          <span className="text-[10px] font-mono text-amber-600 font-bold">Pending</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center font-mono">
          <span>PDF Attached</span>
        </div>
      </div>

      {/* 5. Applied Jobs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-medium">Applied</span>
          <div className="p-1.5 bg-violet-50 rounded-lg text-violet-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900 font-mono">{appliedCount}</span>
          <span className="text-[10px] font-mono text-slate-500">Dispatched</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center font-mono">
          <span>Outreach Sent</span>
        </div>
      </div>

      {/* 6. Replies Received */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-medium">Replies</span>
          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
            <MessageSquare className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-slate-900 font-mono">{repliedCount}</span>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">Scheduled</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center font-mono">
          <span>Interviews</span>
        </div>
      </div>

    </div>
  );
};
