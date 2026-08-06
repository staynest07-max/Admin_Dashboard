import React, { useMemo, useState } from 'react';
import { Bed, Building2, ChevronDown, LayoutGrid, Sparkles } from 'lucide-react';
import { PGListing } from '../../types/merchant';
import { OCCUPANCY_RESIDENTS } from '../../data/occupancyData';
import { computeOccupancyForecast, getPgTotals } from '../../utils/occupancyUtils';
import { OccupancyHierarchyPanel } from './OccupancyHierarchyPanel';
import { OccupancyPredictionsPanel } from './OccupancyPredictionsPanel';

interface AvailabilityViewProps {
  pgListings: PGListing[];
  onUpdateAvailability?: (pgId: string, updatedAvailability: unknown) => void;
}

type ViewTab = 'hierarchy' | 'predictions';

export const AvailabilityView: React.FC<AvailabilityViewProps> = ({ pgListings }) => {
  const [selectedPGId, setSelectedPGId] = useState<string>(
    pgListings.length > 0 ? pgListings[0].id : ''
  );
  const [activeView, setActiveView] = useState<ViewTab>('hierarchy');

  const selectedPG = pgListings.find((p) => p.id === selectedPGId) || pgListings[0];

  const totals = useMemo(
    () => (selectedPG ? getPgTotals(selectedPG) : { totalBeds: 0, availableBeds: 0, occupiedBeds: 0, occupancyPct: 0 }),
    [selectedPG]
  );

  const forecast = useMemo(
    () => (selectedPG ? computeOccupancyForecast(selectedPG, OCCUPANCY_RESIDENTS) : null),
    [selectedPG]
  );

  if (!selectedPG) {
    return (
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-8 text-center shadow-soft-sm">
        <p className="text-sm text-[#6B7280]">No PG listing available to view occupancy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-[#2F3A35]">Occupancy & Availability</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Room-by-room status across buildings, plus forecasts for move-outs and upcoming vacancies.
        </p>
      </div>

      {/* PG Selector */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm">
        <label className="block text-xs font-bold text-[#2F3A35] uppercase tracking-wider mb-2">
          Select PG Property
        </label>
        <div className="relative">
          <select
            value={selectedPGId}
            onChange={(e) => setSelectedPGId(e.target.value)}
            className="w-full pl-4 pr-10 py-3 text-sm bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-bold text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A] appearance-none"
          >
            {pgListings.map((pg) => (
              <option key={pg.id} value={pg.id}>
                {pg.name} — ({pg.area}, {pg.city})
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total Beds', value: totals.totalBeds, color: 'text-[#2F3A35]' },
          { label: 'Occupied', value: totals.occupiedBeds, color: 'text-[#E56363]' },
          { label: 'Vacant', value: totals.availableBeds, color: 'text-[#5DA271]' },
          { label: 'Occupancy', value: `${totals.occupancyPct}%`, color: 'text-[#7B9D8A]' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3.5 rounded-2xl bg-white border border-[#EAE8E4] text-center shadow-soft-sm"
          >
            <span className="text-[10px] text-[#6B7280] font-semibold block">{stat.label}</span>
            <span className={`text-xl font-extrabold font-number ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-2 p-1 bg-[#F3F1EC] rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveView('hierarchy')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'hierarchy'
              ? 'bg-white text-[#7B9D8A] shadow-soft-sm'
              : 'text-[#6B7280]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Room map
        </button>
        <button
          type="button"
          onClick={() => setActiveView('predictions')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeView === 'predictions'
              ? 'bg-white text-[#7B9D8A] shadow-soft-sm'
              : 'text-[#6B7280]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Forecasts
          {forecast && forecast.upcomingMoveOuts.length > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E56363] text-white text-[9px] font-bold flex items-center justify-center">
              {forecast.upcomingMoveOuts.length}
            </span>
          )}
        </button>
      </div>

      {activeView === 'hierarchy' ? (
        <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 sm:p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F3F1EC]">
            <Building2 className="w-5 h-5 text-[#7B9D8A]" />
            <div>
              <h2 className="font-bold text-base text-[#2F3A35]">Building → Floor → Room</h2>
              <p className="text-[11px] text-[#6B7280]">
                Tap a building or floor to expand. Each room shows live status.
              </p>
            </div>
          </div>
          <OccupancyHierarchyPanel rooms={selectedPG.rooms} />
        </div>
      ) : (
        forecast && (
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 sm:p-6 shadow-soft-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F1EC]">
              <Bed className="w-5 h-5 text-[#7B9D8A]" />
              <div>
                <h2 className="font-bold text-base text-[#2F3A35]">Occupancy forecasts</h2>
                <p className="text-[11px] text-[#6B7280]">
                  Based on notice periods, agreement dates, and scheduled move-outs.
                </p>
              </div>
            </div>
            <OccupancyPredictionsPanel forecast={forecast} />
          </div>
        )
      )}
    </div>
  );
};
