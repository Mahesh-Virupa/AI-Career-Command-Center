import React, { useState, useEffect } from 'react';
import { Bot, Calendar, Download, FileText, MessageSquare, Play, RefreshCw, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CandidateProfile } from '../types';

interface HeaderProps {
  profile: CandidateProfile;
  onRunPipeline: () => void;
  onOpenWhatsApp: () => void;
  onOpenResumes: () => void;
  onOpenLogs: () => void;
  isRunningPipeline: boolean;
  lastRunTime?: string;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onRunPipeline,
  onOpenWhatsApp,
  onOpenResumes,
  onOpenLogs,
  isRunningPipeline,
  lastRunTime
}) => {
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0A0A0B]/95 backdrop-blur-md border-b border-zinc-800 text-zinc-100 sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 shadow-inner">
              <Bot className="h-5 w-5 text-zinc-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl font-serif italic text-zinc-100 tracking-tight">AI Career Command Center</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800 rounded uppercase tracking-wider">
                  v2.5 Scout
                </span>
              </div>
              <p className="text-xs font-sans text-zinc-400 flex items-center space-x-2 mt-0.5">
                <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">Portfolio: <strong className="text-zinc-200 font-sans font-semibold">{profile.name}</strong> ({profile.experienceYears}+ Yrs Engineering Leadership)</span>
                <span className="text-zinc-700">•</span>
                <span className="text-emerald-500 flex items-center font-mono text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
                  AUTONOMOUS SCOUT
                </span>
              </p>
            </div>
          </div>

          {/* Schedule Status & Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* IST Clock & Scheduled Scout info */}
            <div className="hidden xl:flex items-center space-x-2.5 px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <div className="flex flex-col">
                <span className="text-zinc-200 font-mono font-medium text-[11px]">{istTime || '05:00 AM IST'}</span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Daily Run: 05:00 IST</span>
              </div>
            </div>

            {/* Resume Vault Trigger */}
            <button
              onClick={onOpenResumes}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition-colors"
              title="View & Download 4 Role-Specific PDF Resumes"
            >
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>4 Résumés</span>
            </button>

            {/* WhatsApp Summary Trigger */}
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 rounded-lg text-xs font-medium transition-colors"
              title="Twilio WhatsApp Daily Summary"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
              <span>WhatsApp Alerts</span>
            </button>

            {/* Agent Logs Trigger */}
            <button
              onClick={onOpenLogs}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-zinc-500" />
              <span>Agent Logs</span>
            </button>

            {/* Primary Action: Run Multi-Agent Pipeline */}
            <button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold text-zinc-950 shadow-lg transition-all ${
                isRunningPipeline
                  ? 'bg-zinc-400 cursor-not-allowed opacity-80'
                  : 'bg-zinc-100 hover:bg-white active:scale-[0.98]'
              }`}
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-zinc-950" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-zinc-950" />
                  <span>Run Multi-Agent Pipeline</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
