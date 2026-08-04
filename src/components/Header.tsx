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

  const formatLastRunToIST = (rawTime?: string): string => {
    if (!rawTime) return '03 Aug 2026, 05:00:00 AM IST';
    try {
      const d = new Date(rawTime);
      if (isNaN(d.getTime())) return rawTime;
      return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' IST';
    } catch {
      return rawTime;
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold font-sans text-slate-900 tracking-tight">AI Career Command Center</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200 rounded uppercase tracking-wider">
                  v2.5 Scout
                </span>
              </div>
              <p className="text-xs font-sans text-slate-500 flex items-center space-x-2 mt-0.5">
                <span className="text-slate-600 font-mono text-[11px]">Portfolio: <strong className="text-slate-800 font-sans font-semibold">{profile.name}</strong> ({profile.experienceYears}+ Yrs Tech Leadership)</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold flex items-center font-mono text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
                  AUTONOMOUS SCOUT READY
                </span>
              </p>
            </div>
          </div>

          {/* Schedule Status & Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Last Runtime Indicator Badge */}
            <button
              onClick={onOpenLogs}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-xs text-slate-700 transition-colors"
              title="Click to view detailed Agent Execution Logs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-500 font-mono uppercase leading-none">Last Runtime (IST)</span>
                <span className="text-slate-800 font-mono font-bold text-[11px] leading-tight">{formatLastRunToIST(lastRunTime)}</span>
              </div>
            </button>
            
            {/* IST Clock */}
            <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-mono font-medium text-[11px]">{istTime || '05:00 AM IST'}</span>
                <span className="text-[9px] text-slate-400 font-mono uppercase">Daily Auto Scout</span>
              </div>
            </div>

            {/* Resume Vault Trigger */}
            <button
              onClick={onOpenResumes}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors shadow-xs"
              title="View & Download 4 Role-Specific PDF Resumes"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>4 Résumés</span>
            </button>

            {/* WhatsApp Summary Trigger */}
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors shadow-xs"
              title="Twilio WhatsApp Daily Summary"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp Alerts</span>
            </button>

            {/* Agent Logs Trigger */}
            <button
              onClick={onOpenLogs}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
              <span>Agent Logs</span>
            </button>

            {/* Primary Action: Run Multi-Agent Pipeline */}
            <button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-all ${
                isRunningPipeline
                  ? 'bg-indigo-400 cursor-not-allowed opacity-80'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                  <span>Running 5 Autonomous Agents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-100" />
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
