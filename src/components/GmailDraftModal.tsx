import React, { useState } from 'react';
import { Check, Copy, ExternalLink, FileText, Mail, Paperclip, Send, ShieldCheck, X } from 'lucide-react';
import { Job, OutreachDraft } from '../types';

interface GmailDraftModalProps {
  job: Job;
  draft: OutreachDraft;
  onClose: () => void;
  onDownloadResume: (fileName: string) => void;
}

export const GmailDraftModal: React.FC<GmailDraftModalProps> = ({
  job,
  draft,
  onClose,
  onDownloadResume
}) => {
  const [copied, setCopied] = useState(false);

  const copyDraftBody = () => {
    navigator.clipboard.writeText(draft.bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 text-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">Gmail Cold Outreach Draft Ready</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded uppercase tracking-wider">
                  OAuth 2.0 Draft Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{job.title} at <strong className="text-slate-800">{job.company}</strong></p>
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
        <div className="overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {/* Safety Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start space-x-2 text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Draft saved directly in your Gmail Drafts folder.</p>
              <p className="text-[11px] text-emerald-800 mt-0.5 font-medium">
                Per outreach compliance rules, automatic sending is <strong>strictly disabled</strong>. You can review, personalize further, and send manually whenever ready.
              </p>
            </div>
          </div>

          {/* Combined Recipients */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Combined Recipients (Hiring + HR)</span>
            <div className="flex flex-wrap gap-1.5">
              {draft.recipients.map((recipient, i) => (
                <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-mono font-semibold">
                  {recipient}
                </span>
              ))}
            </div>
          </div>

          {/* Subject Line */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Subject Line</span>
            <p className="font-bold text-slate-900 text-sm">{draft.subject}</p>
          </div>

          {/* Email Body Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Personalized Email Content</span>
              <button
                onClick={copyDraftBody}
                className="inline-flex items-center space-x-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-mono font-bold"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
              {draft.bodyText}
            </pre>
          </div>

          {/* Automatic Resume Attachment Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                <Paperclip className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider font-semibold">Attached PDF Résumé Variant</span>
                <p className="font-bold text-slate-900 text-xs">{draft.resumeFile}</p>
              </div>
            </div>

            <button
              onClick={() => onDownloadResume(draft.resumeFile)}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>Download PDF</span>
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 pt-3.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 font-mono">Draft ID: {draft.gmailDraftId}</span>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* Direct Gmail Compose Window */}
            <button
              onClick={() => {
                const recipientsList = draft.recipients.map(r => {
                  const match = r.match(/<([^>]+)>/);
                  return match ? match[1] : r;
                }).join(',');
                const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientsList)}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.bodyText)}`;
                window.open(composeUrl, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Open Gmail Compose tab pre-filled with recipient, subject, and body text"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Open Gmail Compose</span>
            </button>

            {/* Gmail Drafts Folder Link */}
            <button
              onClick={() => {
                const draftsUrl = 'https://mail.google.com/mail/u/0/#drafts';
                window.open(draftsUrl, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Open your Gmail Drafts folder in a new browser tab"
            >
              <ExternalLink className="h-3.5 w-3.5 text-white" />
              <span>Open Gmail Drafts Folder</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
