import React from 'react';
import { MessageSquare, Send, ShieldAlert, X } from 'lucide-react';
import { Job } from '../types';

interface WhatsAppModalProps {
  jobs: Job[];
  onClose: () => void;
  onSendTestNotification: () => void;
  isSending: boolean;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  jobs,
  onClose,
  onSendTestNotification,
  isSending
}) => {
  const activeJobs = jobs.filter(j => !j.deletedAt);
  const highMatches = activeJobs.filter(j => j.atsScore >= 80);
  const drafted = activeJobs.filter(j => j.status === 'Drafted');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif italic text-zinc-100">Twilio WhatsApp Summary Connector</h2>
              <p className="text-xs text-zinc-400">Agent E Daily Notification to Mahesh V (+91 98801 23456)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 text-xs overflow-y-auto">
          
          <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-3 text-emerald-200 space-y-1">
            <span className="font-bold text-emerald-300">Notification Rule Safeguard</span>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              Agent E sends WhatsApp summaries containing job counts, high matches, and priority actions. Per compliance policy, <strong>applications and outreach emails are never automatically sent</strong>.
            </p>
          </div>

          {/* WhatsApp Message Bubble Simulation */}
          <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-4 space-y-2 relative">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-800/80 pb-2">
              <span className="font-mono text-emerald-400 font-bold">WhatsApp Business API Payload</span>
              <span className="font-mono">IST Schedule: 05:00 AM</span>
            </div>

            <div className="font-mono text-[11px] text-zinc-200 leading-relaxed space-y-2 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
              <p className="font-bold text-emerald-400">📱 AI CAREER COMMAND CENTER — DAILY REPORT</p>
              <p><strong>Recipient:</strong> Mahesh V (+91 98801 23456)</p>
              <p className="text-zinc-600">------------------------------------</p>
              <p><strong>Daily Scout & ATS Summary:</strong></p>
              <p>• Total Jobs Discovered: {activeJobs.length}</p>
              <p>• High ATS Matches (≥80): {highMatches.length}</p>
              <p>• Gmail Drafts Ready: {drafted.length}</p>
              <p className="text-zinc-600">------------------------------------</p>
              <p><strong>Top Priority Opportunities:</strong></p>
              {highMatches.slice(0, 3).map((j, i) => (
                <p key={j.id} className="text-zinc-200">
                  {i + 1}. {j.title} at <strong>{j.company}</strong> (ATS: {j.atsScore}/100, Résumé: {j.matchedResumeName})
                </p>
              ))}
              <p className="text-[10px] text-zinc-500 italic mt-2">
                Note: Gmail cold outreach drafts are prepared with attached role-specific PDFs in your inbox.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 pt-3.5 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 font-mono">Twilio API Status: Active</span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg font-medium text-xs transition-colors"
            >
              Close
            </button>

            <button
              onClick={onSendTestNotification}
              disabled={isSending}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-colors shadow-md"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSending ? 'Dispatching...' : 'Dispatch Test WhatsApp Alert'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
