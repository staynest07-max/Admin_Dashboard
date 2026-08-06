import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Phone, 
  Calendar,
  UserCheck
} from 'lucide-react';
import { VisitItem, VisitCategory, VisitStatus } from '../../types/merchant';

interface VisitsViewProps {
  visits: VisitItem[];
  onUpdateVisitStatus: (id: string, newStatus: VisitStatus, category?: VisitCategory) => void;
  onRescheduleVisit: (visit: VisitItem) => void;
}

export const VisitsView: React.FC<VisitsViewProps> = ({
  visits,
  onUpdateVisitStatus,
  onRescheduleVisit
}) => {
  const [selectedTab, setSelectedTab] = useState<VisitCategory>('Today');

  const visitTabs: VisitCategory[] = ['Today', 'Upcoming', 'Completed', 'Cancelled'];

  const filteredVisits = visits.filter((v) => v.category === selectedTab);

  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F5EC] text-[#5DA271] border border-[#5DA271]/30">
            CONFIRMED
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFF8E7] text-[#CC8B00] border border-[#F4B740]/40">
            PENDING ACCEPTANCE
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F1FA] text-[#6F9BD1] border border-[#6F9BD1]/30">
            VISIT COMPLETED
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FDECEC] text-[#E56363] border border-[#E56363]/30">
            CANCELLED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2F3A35]">Scheduled Tenant Visits</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Manage upcoming room walkthrough visits, accept visit proposals, reschedule time slots, or mark as completed.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-2 shadow-soft-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {visitTabs.map((tab) => {
            const count = visits.filter((v) => v.category === tab).length;
            const isActive = selectedTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-[#7B9D8A] text-white shadow-soft-sm'
                    : 'bg-[#FFFFFF] text-[#6B7280] hover:bg-[#F3F1EC]'
                }`}
              >
                <span>{tab === 'Today' ? "Today's Visits" : tab}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-number ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#EAE8E4] text-[#2F3A35]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visit Cards */}
      {filteredVisits.length === 0 ? (
        <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-12 text-center shadow-soft-sm">
          <CalendarDays className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#2F3A35]">No visits scheduled in this category</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
            There are currently no visits under {selectedTab}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVisits.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#2F3A35]">{v.visitorName}</h3>
                  <p className="text-xs font-medium text-[#7B9D8A] mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{v.pgName}</span>
                  </p>
                </div>
                {getStatusBadge(v.status)}
              </div>

              {/* Schedule Block */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#FFFFFF] border border-[#F3F1EC] text-xs">
                <div>
                  <span className="text-[11px] text-[#6B7280] block">Visit Date</span>
                  <span className="font-bold text-[#2F3A35] font-number flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#7B9D8A]" />
                    <span>{v.visitDate}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#6B7280] block">Time Slot</span>
                  <span className="font-bold text-[#2F3A35] font-number flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#6F9BD1]" />
                    <span>{v.visitTime}</span>
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-[#6B7280] block">Phone</span>
                  <span className="font-bold text-[#2F3A35] font-number">{v.visitorPhone}</span>
                </div>
              </div>

              {v.notes && (
                <p className="text-xs text-[#6B7280] bg-[#F3F1EC] p-2.5 rounded-xl border border-[#EAE8E4]">
                  <span className="font-semibold text-[#2F3A35]">Visit Note: </span>
                  {v.notes}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F3F1EC] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {v.status === 'Pending' && (
                    <button
                      onClick={() => onUpdateVisitStatus(v.id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-[#5DA271] text-white text-xs font-semibold hover:bg-[#2E7D32]"
                    >
                      Accept
                    </button>
                  )}

                  <button
                    onClick={() => onRescheduleVisit(v)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] hover:text-[#7B9D8A] text-xs font-semibold"
                  >
                    Reschedule
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {v.status !== 'Completed' && v.status !== 'Cancelled' && (
                    <button
                      onClick={() => onUpdateVisitStatus(v.id, 'Completed', 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-[#E8F1FA] text-[#6F9BD1] text-xs font-semibold hover:bg-[#6F9BD1] hover:text-white"
                    >
                      Complete
                    </button>
                  )}

                  {v.status !== 'Cancelled' && (
                    <button
                      onClick={() => onUpdateVisitStatus(v.id, 'Cancelled', 'Cancelled')}
                      className="p-1.5 rounded-xl text-[#6B7280] hover:text-[#E56363] hover:bg-[#FDECEC]"
                      title="Reject / Cancel"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
