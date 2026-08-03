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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl max-w-3xl w-full p-6 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-900 text-zinc-300 rounded-xl border border-zinc-800">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif italic text-zinc-100">Multi-Agent Execution Pipeline Logs</h2>
              <p className="text-xs text-zinc-400">Agent A (Scout), Agent B (ATS), Agent C (Contacts), Agent D (Outreach), Agent E (WhatsApp)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-5 text-xs pr-1">
          
          {/* Agent Run History */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-zinc-400 text-[10px] font-mono uppercase tracking-wider">Scheduled & Manual Agent Runs</h3>
            <div className="space-y-2">
              {agentRuns.map((run) => (
                <div key={run.id} className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-zinc-200 text-sm">{run.agentName} Agent</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{run.status}</span>
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono">
                      Started: {formatTime(run.startedAt)}
                    </span>
                  </div>

                  <p className="text-zinc-300 leading-relaxed">{run.summary}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-zinc-400 font-mono">
                    <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Jobs Found: {run.jobsFound}</span>
                    <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Added: {run.jobsAdded}</span>
                    <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Drafts Created: {run.draftsCreated}</span>
                    <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Contacts Verified: {run.contactsVerified}</span>
                  </div>

                  <div className="text-[10px] text-zinc-500 flex flex-wrap gap-1 mt-1 font-mono">
                    <span className="text-zinc-400 font-semibold">Sources checked:</span>
                    {run.sourcesChecked.map((s, i) => (
                      <span key={i} className="text-zinc-400">{s}{i < run.sourcesChecked.length - 1 ? ',' : ''}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-zinc-400 text-[10px] font-mono uppercase tracking-wider">Application Audit Trail</h3>
            <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3 space-y-2 max-h-[200px] overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="text-[11px] border-b border-zinc-800/80 pb-2 last:border-none last:pb-0">
                  <div className="flex items-center justify-between text-zinc-400 font-mono text-[10px]">
                    <span className="text-zinc-200 font-bold">{log.eventType}</span>
                    <span>{formatTime(log.createdAt)}</span>
                  </div>
                  <p className="text-zinc-300 mt-0.5">{log.notes}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg font-bold text-xs transition-colors"
          >
            Close Logs
          </button>
        </div>

      </div>
    </div>
  );
};
