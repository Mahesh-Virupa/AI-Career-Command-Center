import React from 'react';
import { Filter, Search, Trash2, RotateCcw, X, Calendar } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalActiveCount: number;
  totalDeletedCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalActiveCount,
  totalDeletedCount
}) => {
  const handleChange = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const isFiltered = 
    filters.searchQuery !== '' ||
    filters.location !== 'all' ||
    filters.roleType !== 'all' ||
    filters.companyType !== 'all' ||
    filters.status !== 'all' ||
    filters.minAtsScore > 0 ||
    filters.resumeType !== 'all' ||
    filters.hasVerifiedContacts !== 'all' ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  return (
    <div className="bg-[#111113] border border-zinc-800 rounded-xl p-3.5 mb-4 text-xs text-zinc-300 shadow-sm">
      <div className="flex flex-col gap-3">
        
        {/* Top Row: Switcher & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Active vs Soft Deleted Switcher */}
          <div className="inline-flex rounded-lg bg-[#0A0A0B] p-1 border border-zinc-800">
            <button
              onClick={() => handleChange('showDeleted', false)}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                !filters.showDeleted
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span>Active Tracker</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-zinc-900 rounded-full border border-zinc-700">{totalActiveCount}</span>
            </button>

            <button
              onClick={() => handleChange('showDeleted', true)}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center space-x-1.5 ${
                filters.showDeleted
                  ? 'bg-rose-900/40 text-rose-300 border border-rose-800 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Trash2 className="h-3 w-3" />
              <span>Soft Deleted Jobs</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-zinc-900 rounded-full border border-zinc-700">{totalDeletedCount}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by company, role title, skills, location..."
              value={filters.searchQuery}
              onChange={(e) => handleChange('searchQuery', e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 bg-[#0A0A0B] border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 text-xs font-sans"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleChange('searchQuery', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Bottom Row: Filters including Calendar Date Range */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/60">
          
          {/* Location Filter */}
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="bg-[#0A0A0B] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">Location: All</option>
            <option value="Bengaluru">Bengaluru, India</option>
            <option value="India Remote">India Remote</option>
            <option value="Global Remote">Global Remote</option>
          </select>

          {/* Company Type Filter */}
          <select
            value={filters.companyType}
            onChange={(e) => handleChange('companyType', e.target.value)}
            className="bg-[#0A0A0B] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">Company: All Types</option>
            <option value="GCC">GCC (Global Capability Center)</option>
            <option value="Fintech">Fintech & Payments</option>
            <option value="Banking">Banking & Financial</option>
            <option value="Startup">Well-Funded Startup</option>
            <option value="Enterprise Product">Enterprise Product Co.</option>
          </select>

          {/* ATS Score Filter */}
          <select
            value={filters.minAtsScore}
            onChange={(e) => handleChange('minAtsScore', Number(e.target.value))}
            className="bg-[#0A0A0B] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-600 font-medium"
          >
            <option value={80}>ATS Score: &ge; 80 Match [Default Filter]</option>
            <option value={90}>Top Tier Match (&ge; 90)</option>
            <option value={70}>All Matches (&ge; 70)</option>
            <option value={1}>Show Low Matches (&lt; 80)</option>
          </select>

          {/* Application Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="bg-[#0A0A0B] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-zinc-600"
          >
            <option value="all">Status: All</option>
            <option value="New">Status: New</option>
            <option value="Drafted">Status: Drafted</option>
            <option value="Applied">Status: Applied</option>
            <option value="Replied">Status: Replied</option>
            <option value="Rejected">Status: Rejected</option>
          </select>

          {/* Calendar Date Range Picker */}
          <div className="flex items-center space-x-1.5 bg-[#0A0A0B] border border-zinc-800 rounded-lg px-2 py-1">
            <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span className="text-zinc-500 font-mono text-[11px]">Date:</span>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none font-mono cursor-pointer"
              title="Filter jobs posted/discovered from this date"
            />
            <span className="text-zinc-600">to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none font-mono cursor-pointer"
              title="Filter jobs posted/discovered up to this date"
            />
            {(filters.startDate || filters.endDate) && (
              <button
                onClick={() => {
                  handleChange('startDate', '');
                  handleChange('endDate', '');
                }}
                className="text-zinc-500 hover:text-zinc-300 pl-1"
                title="Clear date range filter"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors border border-zinc-700"
              title="Clear all active filters"
            >
              <RotateCcw className="h-3 w-3 text-zinc-400" />
              <span>Reset Filters</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
