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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 text-zinc-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-serif italic text-zinc-100">Gmail Cold Outreach Draft Created</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded uppercase tracking-wider">
                  OAuth 2.0 Draft Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400">{job.title} at <strong className="text-zinc-200">{job.company}</strong></p>
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
        <div className="overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {/* Safety Banner */}
          <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-3 flex items-start space-x-2 text-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300">Draft saved directly in your Gmail Drafts folder.</p>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                Per outreach compliance rules, automatic sending is <strong>strictly disabled</strong>. You can review, personalize further, and send manually whenever ready.
              </p>
            </div>
          </div>

          {/* Combined Recipients */}
          <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3 space-y-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Combined Recipients (Hiring + HR)</span>
            <div className="flex flex-wrap gap-1.5">
              {draft.recipients.map((recipient, i) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono font-medium">
                  {recipient}
                </span>
              ))}
            </div>
          </div>

          {/* Subject Line */}
          <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Subject Line</span>
            <p className="font-semibold text-zinc-100 text-sm">{draft.subject}</p>
          </div>

          {/* Email Body Preview */}
          <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-3.5 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-semibold">Personalized Email Content</span>
              <button
                onClick={copyDraftBody}
                className="inline-flex items-center space-x-1 text-[11px] text-zinc-400 hover:text-zinc-200 font-mono"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
              {draft.bodyText}
            </pre>
          </div>

          {/* Automatic Resume Attachment Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700">
                <Paperclip className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Attached PDF Résumé Variant</span>
                <p className="font-semibold text-zinc-200 text-xs">{draft.resumeFile}</p>
              </div>
            </div>

            <button
              onClick={() => onDownloadResume(draft.resumeFile)}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-800 pt-3.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-zinc-500 font-mono">Draft ID: {draft.gmailDraftId}</span>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition-colors"
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
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
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
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              title="Open your Gmail Drafts folder in a new browser tab"
            >
              <ExternalLink className="h-3.5 w-3.5 text-zinc-950" />
              <span>Open Gmail Drafts Folder</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
