import React from 'react';
import { Filter, SlidersHorizontal, LayoutGrid, Table, ArrowUpDown, RefreshCw } from 'lucide-react';
import { MerchantFilterState, MerchantStatus } from '../../types/merchant';

interface MerchantFilterBarProps {
  filters: MerchantFilterState;
  onFilterChange: (newFilters: Partial<MerchantFilterState>) => void;
  onResetFilters: () => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  availableCities: string[];
  totalResultsCount: number;
}

const STATUS_TABS: { label: string; value: MerchantStatus | 'All'; countBadge?: number }[] = [
  { label: 'All Merchants', value: 'All' },
  { label: 'Verified', value: 'Verified' },
  { label: 'Pending Verification', value: 'Pending Verification' },
  { label: 'Changes Requested', value: 'Changes Requested' },
  { label: 'Suspended', value: 'Suspended' },
  { label: 'Blocked', value: 'Blocked' },
];

export const MerchantFilterBar: React.FC<MerchantFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
  availableCities,
  totalResultsCount,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-[#EAE8E4] shadow-soft-sm mb-6 space-y-4">
      {/* Top Row: Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange({ status: tab.value })}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#7B9D8A] text-white shadow-soft-sm font-semibold'
                  : 'bg-[#FFFFFF] text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#6D8F7D] border border-[#EAE8E4]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Multi-Dropdown Filters & Sorting */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-[#F3F1EC]">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#EAE8E4] px-3 py-1.5 rounded-2xl text-xs">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className="text-[#6B7280] hidden sm:inline">City:</span>
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="bg-transparent font-medium text-[#2F3A35] focus:outline-none cursor-pointer"
            >
              <option value="All">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Business Type Filter */}
          <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#EAE8E4] px-3 py-1.5 rounded-2xl text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className="text-[#6B7280] hidden sm:inline">Type:</span>
            <select
              value={filters.businessType}
              onChange={(e) => onFilterChange({ businessType: e.target.value })}
              className="bg-transparent font-medium text-[#2F3A35] focus:outline-none cursor-pointer"
            >
              <option value="All">All Business Types</option>
              <option value="Private Limited">Private Limited</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#EAE8E4] px-3 py-1.5 rounded-2xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280]" />
            <span className="text-[#6B7280] hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-transparent font-medium text-[#2F3A35] focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="revenue_high">Highest Revenue</option>
              <option value="rating_high">Highest Rating</option>
              <option value="pgs_count">Most PGs</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#7B9D8A] px-2.5 py-1.5 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>

        {/* Results Counter & View Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t lg:border-t-0 pt-2 lg:pt-0">
          <span className="text-xs text-[#6B7280]">
            Showing <strong className="text-[#2F3A35] font-number">{totalResultsCount}</strong> merchants
          </span>

          <div className="flex items-center p-0.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#7B9D8A] text-white shadow-soft-sm'
                  : 'text-[#6B7280] hover:text-[#2F3A35]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-[#7B9D8A] text-white shadow-soft-sm'
                  : 'text-[#6B7280] hover:text-[#2F3A35]'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
