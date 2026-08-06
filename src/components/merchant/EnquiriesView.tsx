import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock, 
  UserCheck, 
  Building2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { EnquiryItem, EnquiryStatus } from '../../types/merchant';

interface EnquiriesViewProps {
  enquiries: EnquiryItem[];
  onUpdateEnquiryStatus: (id: string, newStatus: EnquiryStatus) => void;
  onOpenScheduleVisit: (enquiry: EnquiryItem) => void;
  onOpenWhatsApp: (enquiry: EnquiryItem) => void;
  onCallTenant: (tenantPhone: string) => void;
}

export const EnquiriesView: React.FC<EnquiriesViewProps> = ({
  enquiries,
  onUpdateEnquiryStatus,
  onOpenScheduleVisit,
  onOpenWhatsApp,
  onCallTenant
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterTabs = ['All', 'New', 'Contacted', 'Visit Scheduled', 'Booked', 'Closed'];

  const filteredEnquiries = enquiries.filter((e) => {
    if (selectedFilter !== 'All') {
      const targetStatus = selectedFilter.toUpperCase().replace(' ', '_');
      if (selectedFilter === 'New' && e.status !== 'NEW') return false;
      if (selectedFilter === 'Contacted' && e.status !== 'CONTACTED') return false;
      if (selectedFilter === 'Visit Scheduled' && e.status !== 'VISIT SCHEDULED') return false;
      if (selectedFilter === 'Booked' && e.status !== 'BOOKED') return false;
      if (selectedFilter === 'Closed' && e.status !== 'CLOSED') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.tenantName.toLowerCase().includes(q);
      const matchPG = e.pgName.toLowerCase().includes(q);
      const matchPhone = e.tenantPhone.toLowerCase().includes(q);
      if (!matchName && !matchPG && !matchPhone) return false;
    }

    return true;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFF5E8] text-[#C9952A] border border-[#C9952A]/30 animate-pulse">
            NEW ENQUIRY
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F1FA] text-[#6F9BD1] border border-[#6F9BD1]/30">
            CONTACTED
          </span>
        );
      case 'VISIT SCHEDULED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DDE9E0] text-[#7B9D8A] border border-[#D8C29B]">
            VISIT SCHEDULED
          </span>
        );
      case 'BOOKED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8F5EC] text-[#5DA271] border border-[#5DA271]/30">
            BOOKED
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F3F1EC] text-[#6B7280] border border-[#EAE8E4]">
            CLOSED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3A35]">Prospective Tenant Enquiries</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Respond to prospective tenants, make phone calls, send WhatsApp messages, or schedule room visits.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-4 shadow-soft-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === tab
                    ? 'bg-[#7B9D8A] text-white shadow-soft-sm'
                    : 'bg-[#FFFFFF] text-[#6B7280] border border-[#EAE8E4] hover:bg-[#F3F1EC]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search tenant name or PG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-1.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-[18px] focus:outline-none focus:border-[#7B9D8A]"
            />
          </div>
        </div>
      </div>

      {/* Enquiries Cards List */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-12 text-center shadow-soft-sm">
          <MessageSquare className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#2F3A35]">No enquiries found</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
            No tenant enquiries match the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#2F3A35]">{enq.tenantName}</h3>
                  </div>
                  <p className="text-xs font-medium text-[#7B9D8A] mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{enq.pgName}</span>
                  </p>
                </div>
                {getStatusBadge(enq.status)}
              </div>

              {/* Detail Info Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#FFFFFF] border border-[#F3F1EC] text-xs">
                <div>
                  <span className="text-[11px] text-[#6B7280] block">Interested Room</span>
                  <span className="font-bold text-[#2F3A35]">{enq.roomType}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#6B7280] block">Move-in Date</span>
                  <span className="font-bold text-[#2F3A35] font-number">{enq.moveInDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-[#6B7280] block">Phone Number</span>
                  <span className="font-bold text-[#2F3A35] font-number">{enq.tenantPhone}</span>
                </div>
              </div>

              {enq.notes && (
                <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#D8C29B] text-xs text-[#2F3A35]">
                  <span className="font-semibold">Note: </span>
                  <span>{enq.notes}</span>
                </div>
              )}

              {/* Card Actions Toolbar */}
              <div className="pt-3 border-t border-[#F3F1EC] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCallTenant(enq.tenantPhone)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#5DA271] text-white text-xs font-semibold hover:bg-[#2E7D32] transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </button>

                  <button
                    onClick={() => onOpenWhatsApp(enq)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenScheduleVisit(enq)}
                    className="px-3 py-1.5 rounded-xl bg-[#DDE9E0] text-[#7B9D8A] border border-[#D8C29B] text-xs font-semibold hover:bg-[#DDE9E0] transition-all"
                  >
                    Schedule Visit
                  </button>

                  {enq.status === 'NEW' && (
                    <button
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'CONTACTED')}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] hover:text-[#7B9D8A] text-xs font-semibold"
                    >
                      Mark Contacted
                    </button>
                  )}

                  {enq.status !== 'CLOSED' && (
                    <button
                      onClick={() => onUpdateEnquiryStatus(enq.id, 'CLOSED')}
                      className="p-1.5 rounded-xl text-[#6B7280] hover:text-[#E56363] hover:bg-[#FDECEC]"
                      title="Close Enquiry"
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
