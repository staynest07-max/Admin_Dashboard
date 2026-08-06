import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  CalendarClock,
  LogOut,
  FileWarning,
  Bed,
  Sparkles,
} from 'lucide-react';
import { OccupancyForecast } from '../../types/merchant';

interface OccupancyPredictionsPanelProps {
  forecast: OccupancyForecast;
  compact?: boolean;
}

export const OccupancyPredictionsPanel: React.FC<OccupancyPredictionsPanelProps> = ({
  forecast,
  compact = false,
}) => {
  const { expectedNextMonth } = forecast;
  const trendUp = expectedNextMonth.changeFromToday >= 0;

  return (
    <div className={`space-y-4 ${compact ? '' : 'space-y-5'}`}>
      {/* Expected occupancy next month — hero card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FAF8F4] to-[#DDE9E0] border border-[#D8C29B]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-[#7B9D8A] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Expected next month
            </p>
            <p className="text-3xl font-extrabold text-[#2F3A35] font-number mt-1">
              {expectedNextMonth.occupancyRate}%
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {expectedNextMonth.occupiedBeds} of {expectedNextMonth.totalBeds} beds occupied
            </p>
          </div>
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold ${
              trendUp
                ? 'bg-[#E8F5EC] text-[#5DA271]'
                : 'bg-[#FDECEC] text-[#E56363]'
            }`}
          >
            {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {expectedNextMonth.changeFromToday >= 0 ? '+' : ''}
            {expectedNextMonth.changeFromToday}% vs today
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Beds vacant next week */}
        <PredictionCard
          icon={Bed}
          iconBg="bg-[#E8F5EC]"
          iconColor="text-[#5DA271]"
          title="Beds vacant next week"
          count={forecast.bedsVacantNextWeek.length}
          emptyText="No beds freeing up in the next 7 days"
        >
          {forecast.bedsVacantNextWeek.map((item, i) => (
            <li key={`vac-${i}`} className="flex items-start justify-between gap-2 text-[11px]">
              <span className="text-[#2F3A35] font-semibold">
                {item.building}
                {item.floorOrWing ? ` · ${item.floorOrWing}` : ''} · Rm {item.roomNumber}
              </span>
              <span className="text-[#5DA271] font-bold shrink-0">
                {item.bedsBecomingVacant} bed{item.bedsBecomingVacant !== 1 ? 's' : ''} · {item.date}
              </span>
            </li>
          ))}
        </PredictionCard>

        {/* Upcoming move-outs */}
        <PredictionCard
          icon={LogOut}
          iconBg="bg-[#FFF8E7]"
          iconColor="text-[#C9952A]"
          title="Upcoming move-outs"
          count={forecast.upcomingMoveOuts.length}
          emptyText="No scheduled move-outs this week"
        >
          {forecast.upcomingMoveOuts.map((item, i) => (
            <li key={`mo-${i}`} className="flex items-start justify-between gap-2 text-[11px]">
              <span className="text-[#2F3A35] font-semibold">
                {item.tenantName}
                <span className="text-[#6B7280] font-normal"> · Rm {item.roomNumber}</span>
              </span>
              <span className="text-[#C9952A] font-bold shrink-0">{item.moveOutDate}</span>
            </li>
          ))}
        </PredictionCard>

        {/* Expiring agreements */}
        <PredictionCard
          icon={FileWarning}
          iconBg="bg-[#FDECEC]"
          iconColor="text-[#E56363]"
          title="Expiring agreements"
          count={forecast.expiringAgreements.length}
          emptyText="No agreements expiring in 30 days"
          className="sm:col-span-2"
        >
          {forecast.expiringAgreements.map((item, i) => (
            <li key={`ag-${i}`} className="flex items-start justify-between gap-2 text-[11px]">
              <span className="text-[#2F3A35] font-semibold">
                {item.tenantName}
                <span className="text-[#6B7280] font-normal">
                  {' '}
                  · Rm {item.roomNumber}
                  {item.building ? ` · ${item.building}` : ''}
                </span>
              </span>
              <span className="text-[#E56363] font-bold shrink-0">
                {item.daysLeft === 0 ? 'Today' : `${item.daysLeft}d left`} · {item.agreementEndDate}
              </span>
            </li>
          ))}
        </PredictionCard>
      </div>
    </div>
  );
};

function PredictionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  count,
  emptyText,
  children,
  className = '',
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  count: number;
  emptyText: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 rounded-2xl bg-white border border-[#EAE8E4] ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h4 className="text-xs font-bold text-[#2F3A35] flex-1">{title}</h4>
        {count > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3F1EC] text-[#6B7280] font-number">
            {count}
          </span>
        )}
      </div>
      {count === 0 ? (
        <p className="text-[11px] text-[#6B7280] flex items-center gap-1.5">
          <CalendarClock className="w-3.5 h-3.5" />
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-2">{children}</ul>
      )}
    </div>
  );
}
