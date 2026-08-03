import React from 'react';
import { Radio, RefreshCw, Zap } from 'lucide-react';

interface MovingTickerProps {
  onTriggerLiveCrawl?: () => void;
  isCrawling?: boolean;
}

export const MovingTicker: React.FC<MovingTickerProps> = ({
  onTriggerLiveCrawl,
  isCrawling = false
}) => {
  const tickerItems = [
    '🔥 BENGALURU & REMOTE CRAWL ACTIVE: Searching LinkedIn, Naukri, Instahyre, YCombinator, Google & RemoteOK',
    '⚡ RAZORPAY: Director of Engineering — Payment Systems (Bengaluru / Remote) • ATS Score: 96 • Verified Contact: Harshil Mathur (CEO)',
    '⚡ GOLDMAN SACHS: Vice President — Payment Engineering (Bengaluru GCC) • ATS Score: 92 • Verified Contact: Sunita Menon (HR Lead)',
    '⚡ PHONEPE: Director of Software Engineering (Bengaluru / Remote Option) • ATS Score: 94 • Verified Contact: Rahul Chari (CTO)',
    '⚡ SWIGGY: Principal Software Engineer — Distributed Platform (Bengaluru / Remote) • ATS Score: 90 • Verified Contact: Madhusudhan Rao (VP Tech)',
    '⚡ ATLASSIAN: Principal Software Engineer — Cloud Platform Infra (Bengaluru GCC / Hybrid) • ATS Score: 93 • Verified Contact: Anupam Mitra (Director)',
    '⚡ JPMORGAN CHASE: Executive Director / VP — Core Payments Architecture (Bengaluru GCC) • ATS Score: 96 • Verified Contact: Rajesh K. Nair (MD)',
    '⚡ CRED: Director of Engineering — Financial Services Rails (Bengaluru / Remote) • ATS Score: 94 • Verified Contact: Kunal Shah (Founder)',
    '⚡ MEESHO: Principal Architect — High Scale Distributed Systems (Bengaluru / Remote) • ATS Score: 90 • Verified Contact: Sanjeev Barnwal (CTO)',
    '⚡ UBER INDIA: Senior Engineering Manager — Payments & Ledger (Bengaluru Tech Center) • ATS Score: 92 • Verified Contact: Nitin Agrawal (Director)',
    '⚡ FLIPKART: Principal Software Engineer — Checkout & Payment Systems (Bengaluru) • ATS Score: 93 • Verified Contact: Jeyandran Venugopal (CPTO)',
    '🎯 RESUME VAULT: 4 Mahesh V Authentic PDF Résumés Active (Enterprise Architect, Principal Engineer, Director of Eng, SEM)',
    '⏰ AUTOMATED SCRAPER: Daily 05:00 AM IST Scrape Pipeline Active • Click to Crawl Fresh Bengaluru Jobs Now'
  ];

  return (
    <div className="bg-[#050506] border-b border-zinc-800/80 text-zinc-300 py-1.5 px-3 overflow-hidden text-[11px] font-mono select-none flex items-center relative z-20">
      <button
        onClick={onTriggerLiveCrawl}
        disabled={isCrawling}
        className={`flex items-center space-x-2 px-3 py-1 rounded shrink-0 z-10 shadow-sm mr-3 transition-all cursor-pointer ${
          isCrawling 
            ? 'bg-amber-950/80 border border-amber-800/80 text-amber-300 animate-pulse'
            : 'bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-800/80 text-indigo-300 hover:text-white'
        }`}
        title="Click to trigger Live Bengaluru & Remote Job Crawler and instantly refresh dashboard"
      >
        {isCrawling ? (
          <RefreshCw className="h-3 w-3 text-amber-400 animate-spin" />
        ) : (
          <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
        )}
        <span className="font-bold uppercase text-[10px] tracking-wider">
          {isCrawling ? 'CRAWLING BENGALURU JOBS...' : '⚡ REFRESH LIVE BENGALURU CRAWLER'}
        </span>
      </button>

      <div 
        onClick={onTriggerLiveCrawl}
        className="overflow-hidden whitespace-nowrap w-full relative cursor-pointer group"
        title="Click to trigger live crawler search for new Bengaluru & Remote jobs"
      >
        <div className="inline-block animate-marquee space-x-8">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="inline-flex items-center space-x-1.5 text-zinc-300 group-hover:text-amber-300 transition-colors">
              <Zap className="h-3 w-3 text-amber-400 inline shrink-0" />
              <span>{item}</span>
              <span className="text-zinc-700 px-2">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
