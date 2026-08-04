import React from 'react';
import { Bot, CheckCircle2, Clock, RefreshCw, Sparkles, X } from 'lucide-react';
import { AgentRun, ApplicationLog } from '../types';

interface AgentLogsModalProps {
  agentRuns: AgentRun[];
  logs: ApplicationLog[];
  onClose: () => void;
}

export const AgentLogsModal: React.FC<AgentLogsModalProps> = ({
  agentRuns,
  logs,
  onClose
}) => {
  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST';
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 text-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Multi-Agent Execution Pipeline Logs</h2>
              <p className="text-xs text-slate-500 font-medium">Agent A (Scout), Agent B (ATS), Agent C (Contacts), Agent D (Outreach), Agent E (WhatsApp)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-5 text-xs pr-1">
          
          {/* Agent Run History */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-700 text-[10px] font-mono uppercase tracking-wider">Scheduled & Manual Agent Runs</h3>
            <div className="space-y-2">
              {agentRuns.map((run) => (
                <div key={run.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{run.agentName} Agent</span>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{run.status}</span>
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      Started: {formatTime(run.startedAt)}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-medium">{run.summary}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-600 font-mono font-medium">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Jobs Found: {run.jobsFound}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Added: {run.jobsAdded}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Drafts Created: {run.draftsCreated}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Contacts Verified: {run.contactsVerified}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 flex flex-wrap gap-1 mt-1 font-mono">
                    <span className="text-slate-700 font-semibold">Sources checked:</span>
                    {run.sourcesChecked.map((s, i) => (
                      <span key={i} className="text-slate-600">{s}{i < run.sourcesChecked.length - 1 ? ',' : ''}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-700 text-[10px] font-mono uppercase tracking-wider">Application Audit Trail</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 max-h-[200px] overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="text-[11px] border-b border-slate-200 pb-2 last:border-none last:pb-0">
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                    <span className="text-slate-800 font-bold">{log.eventType}</span>
                    <span>{formatTime(log.createdAt)}</span>
                  </div>
                  <p className="text-slate-700 mt-0.5 font-medium">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs transition-colors border border-slate-200 cursor-pointer"
          >
            Close Logs
          </button>
        </div>

      </div>
    </div>
  );
};
