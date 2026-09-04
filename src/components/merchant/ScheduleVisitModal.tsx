import React, { useState } from 'react';
import { CalendarDays, Clock, User, Building2, X, CheckCircle2 } from 'lucide-react';
import { EnquiryItem, VisitItem } from '../../types/merchant';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  enquiry?: EnquiryItem | null;
  onClose: () => void;
  onScheduleVisit: (newVisit: VisitItem) => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  enquiry,
  onClose,
  onScheduleVisit
}) => {
  const [visitorName, setVisitorName] = useState(enquiry ? enquiry.tenantName : 'Sneha Kapur');
  const [visitorPhone, setVisitorPhone] = useState(enquiry ? enquiry.tenantPhone : '+91 98765 00112');
  const [pgName, setPgName] = useState(enquiry ? enquiry.pgName : "Sunrise Women's PG");
  const [visitDate, setVisitDate] = useState('2026-07-28');
  const [visitTime, setVisitTime] = useState('04:00 PM');
  const [notes, setNotes] = useState(enquiry ? `Interested in ${enquiry.roomType}` : 'Room walkthrough visit');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisit: VisitItem = {
      id: `VST-${Date.now()}`,
      visitorName,
      visitorPhone,
      pgId: enquiry ? enquiry.pgId : 'PG-001',
      pgName,
      visitDate,
      visitTime,
      status: 'CONFIRMED',
      category: 'Upcoming',
      notes
    };
    onScheduleVisit(newVisit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-soft-lg space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#6B7280] hover:text-[#2F3A35] rounded-xl hover:bg-[#F3F1EC]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#2F3A35]">Schedule Tenant Room Visit</h2>
          <p className="text-xs text-[#6B7280]">Set date & time slot for in-person property tour.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2F3A35] mb-1">Visitor Name</label>
            <input
              type="text"
              required
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2F3A35] mb-1">Visitor Phone</label>
            <input
              type="text"
              required
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#2F3A35] mb-1">Target PG Property</label>
            <input
              type="text"
              required
              value={pgName}
              onChange={(e) => setPgName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#2F3A35] mb-1">Visit Date</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2F3A35] mb-1">Time Slot</label>
              <input
                type="text"
                required
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2F3A35] mb-1">Visit Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#7B9D8A] text-white font-bold rounded-2xl hover:bg-[#6D8F7D] shadow-soft-sm"
          >
            Confirm & Schedule Visit
          </button>
        </form>
      </div>
    </div>
  );
};
