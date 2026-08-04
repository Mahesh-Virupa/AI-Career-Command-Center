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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Twilio WhatsApp Summary Connector</h2>
              <p className="text-xs text-slate-500 font-medium">Agent E Daily Notification to Mahesh V (+91 98865 49126)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 text-xs overflow-y-auto">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 space-y-1">
            <span className="font-bold text-emerald-900">Notification Rule Safeguard</span>
            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
              Agent E sends WhatsApp summaries containing job counts, high matches, and priority actions. Per compliance policy, <strong>applications and outreach emails are never automatically sent</strong>.
            </p>
          </div>

          {/* WhatsApp Message Bubble Simulation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 relative">
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-200 pb-2">
              <span className="font-mono text-emerald-700 font-bold">WhatsApp Business API Payload</span>
              <span className="font-mono">IST Schedule: 05:00 AM</span>
            </div>

            <div className="font-mono text-[11px] text-slate-800 leading-relaxed space-y-2 bg-white p-3 rounded-lg border border-slate-200">
              <p className="font-bold text-emerald-700">📱 AI CAREER COMMAND CENTER — DAILY REPORT</p>
              <p><strong>Recipient:</strong> Mahesh V (+91 98865 49126)</p>
              <p className="text-slate-300">------------------------------------</p>
              <p><strong>Daily Scout & ATS Summary:</strong></p>
              <p>• Total Jobs Discovered: {activeJobs.length}</p>
              <p>• High ATS Matches (≥80): {highMatches.length}</p>
              <p>• Gmail Drafts Ready: {drafted.length}</p>
              <p className="text-slate-300">------------------------------------</p>
              <p><strong>Top Priority Opportunities:</strong></p>
              {highMatches.slice(0, 3).map((j, i) => (
                <p key={j.id} className="text-slate-800 font-medium">
                  {i + 1}. {j.title} at <strong>{j.company}</strong> (ATS: {j.atsScore}/100, Résumé: {j.matchedResumeName})
                </p>
              ))}
              <p className="text-[10px] text-slate-500 italic mt-2">
                Note: Gmail cold outreach drafts are prepared with attached role-specific PDFs in your inbox.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-3.5 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">Twilio API Status: Active</span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={onSendTestNotification}
              disabled={isSending}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Send className="h-3.5 w-3.5 text-white" />
              <span>{isSending ? 'Sending Payload...' : 'Send Test Notification'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
