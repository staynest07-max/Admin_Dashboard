import React, { useMemo, useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Building2,
  MessageSquare,
  Bed,
  Calendar,
  Bell,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { DashboardTab } from '../../types/merchant';

interface ResidentsViewProps {
  onOpenWhatsAppModal: (phone: string, name: string) => void;
  onSelectTab: (tab: DashboardTab) => void;
  merchantQrReady?: boolean;
}

type ResidentStatus = 'Staying' | 'Notice Period' | 'Moved Out';

type Resident = {
  id: string;
  tenantName: string;
  phone: string;
  pgName: string;
  roomType: string;
  roomNumber: string;
  joinedDate: string; // display
  joinDay: number; // day of month they joined (1-31)
  paymentDay: number; // rent due day each month (merchant can change)
  rent: string;
  status: ResidentStatus;
  smsReminders: boolean;
};

function dayLabel(day: number) {
  if (day === 1 || day === 21 || day === 31) return `${day}st`;
  if (day === 2 || day === 22) return `${day}nd`;
  if (day === 3 || day === 23) return `${day}rd`;
  return `${day}th`;
}

function nextPaymentLabel(paymentDay: number) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const lastDayThisMonth = new Date(y, m + 1, 0).getDate();
  const dueThisMonth = Math.min(paymentDay, lastDayThisMonth);
  let due = new Date(y, m, dueThisMonth);
  if (due < new Date(y, m, now.getDate())) {
    const nextM = m + 1;
    const lastNext = new Date(y, nextM + 1, 0).getDate();
    due = new Date(y, nextM, Math.min(paymentDay, lastNext));
  }
  return due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'RES-8901',
    tenantName: 'Rohan Verma',
    phone: '+91 98765 11223',
    pgName: 'Green Residency',
    roomType: '2 Sharing',
    roomNumber: '204',
    joinedDate: '01 Mar 2026',
    joinDay: 1,
    paymentDay: 1,
    rent: '₹12,500 / mo',
    status: 'Staying',
    smsReminders: true,
  },
  {
    id: 'RES-8902',
    tenantName: 'Ananya Sharma',
    phone: '+91 98765 33445',
    pgName: "Sunrise Women's PG",
    roomType: 'Single Deluxe',
    roomNumber: '102',
    joinedDate: '15 Jan 2026',
    joinDay: 15,
    paymentDay: 15,
    rent: '₹17,500 / mo',
    status: 'Staying',
    smsReminders: true,
  },
  {
    id: 'RES-8903',
    tenantName: 'Karthik Raja',
    phone: '+91 98765 55667',
    pgName: 'Urban Nest Co-Living',
    roomType: '3 Sharing',
    roomNumber: '301',
    joinedDate: '20 Feb 2026',
    joinDay: 20,
    paymentDay: 20,
    rent: '₹10,000 / mo',
    status: 'Staying',
    smsReminders: true,
  },
  {
    id: 'RES-8904',
    tenantName: 'Sneha Patel',
    phone: '+91 98765 77889',
    pgName: 'Starlight Executive PG',
    roomType: '2 Sharing',
    roomNumber: '105',
    joinedDate: '10 Dec 2025',
    joinDay: 10,
    paymentDay: 5,
    rent: '₹14,000 / mo',
    status: 'Notice Period',
    smsReminders: true,
  },
];

export const ResidentsView: React.FC<ResidentsViewProps> = ({
  onOpenWhatsAppModal,
  onSelectTab,
  merchantQrReady = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | ResidentStatus>('All');
  const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDay, setEditDay] = useState<number>(1);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const filteredResidents = useMemo(
    () =>
      residents.filter((r) => {
        const matchesSearch =
          r.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.pgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'All' || r.status === filterStatus;
        return matchesSearch && matchesFilter;
      }),
    [residents, searchQuery, filterStatus]
  );

  const stayingCount = residents.filter((r) => r.status === 'Staying').length;
  const smsOnCount = residents.filter((r) => r.smsReminders && r.status !== 'Moved Out').length;

  const startEditPaymentDay = (r: Resident) => {
    setEditingId(r.id);
    setEditDay(r.paymentDay);
  };

  const savePaymentDay = (id: string) => {
    const day = Math.min(31, Math.max(1, Number(editDay) || 1));
    setResidents((prev) =>
      prev.map((r) => (r.id === id ? { ...r, paymentDay: day } : r))
    );
    setEditingId(null);
    showToast(`Payment date updated to every month's ${dayLabel(day)}. SMS will follow this date.`);
  };

  const resetToJoinDay = (r: Resident) => {
    setResidents((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, paymentDay: x.joinDay } : x))
    );
    setEditingId(null);
    showToast(`Payment date reset to join day (${dayLabel(r.joinDay)} of every month).`);
  };

  const toggleSms = (id: string) => {
    setResidents((prev) =>
      prev.map((r) => (r.id === id ? { ...r, smsReminders: !r.smsReminders } : r))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 right-4 z-50 px-4 py-3 rounded-2xl bg-[#7B9D8A] text-white text-xs font-semibold shadow-soft-lg max-w-sm">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3A35]">Residents</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Who is staying with you, when rent is due, and auto SMS reminders.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('enquiries')}
          className="px-4 py-2 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] font-bold text-xs hover:bg-[#DDE9E0] transition-all"
        >
          View Enquiries & Visits
        </button>
      </div>

      {!merchantQrReady && (
        <button
          type="button"
          onClick={() => onSelectTab('earnings')}
          className="w-full p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#D8C29B] text-left text-xs font-bold text-[#7B9D8A] hover:bg-[#DDE9E0]"
        >
          Add your payment QR so residents know where to pay →
        </button>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#EAE8E4] rounded-2xl p-4 shadow-soft-sm">
          <span className="text-[11px] text-[#6B7280] font-semibold">Total</span>
          <p className="text-2xl font-extrabold text-[#2F3A35] font-number mt-1">{residents.length}</p>
        </div>
        <div className="bg-white border border-[#EAE8E4] rounded-2xl p-4 shadow-soft-sm">
          <span className="text-[11px] text-[#6B7280] font-semibold">Staying now</span>
          <p className="text-2xl font-extrabold text-[#5DA271] font-number mt-1">{stayingCount}</p>
        </div>
        <div className="bg-white border border-[#EAE8E4] rounded-2xl p-4 shadow-soft-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] text-[#6B7280] font-semibold">Auto SMS ON</span>
          <p className="text-2xl font-extrabold text-[#7B9D8A] font-number mt-1">{smsOnCount}</p>
        </div>
        <div className="bg-white border border-[#EAE8E4] rounded-2xl p-4 shadow-soft-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] text-[#6B7280] font-semibold">SMS idea</span>
          <p className="text-[11px] text-[#2F3A35] mt-1.5 leading-snug">
            “Rent due today. Pay owner via their QR.”
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-4 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search resident, room or PG..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl text-xs font-medium text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(['All', 'Staying', 'Notice Period', 'Moved Out'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                filterStatus === st
                  ? 'bg-[#7B9D8A] text-white shadow-soft-xs'
                  : 'bg-[#FFFFFF] border border-[#EAE8E4] text-[#6B7280] hover:text-[#2F3A35]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile-friendly cards + desktop table feel */}
      <div className="space-y-3">
        {filteredResidents.map((r) => {
          const isEditing = editingId === r.id;
          return (
            <div
              key={r.id}
              className="bg-white border border-[#EAE8E4] rounded-[24px] p-4 sm:p-5 shadow-soft-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#DDE9E0] text-[#7B9D8A] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-[#2F3A35]">{r.tenantName}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'Staying'
                            ? 'bg-[#E8F5EC] text-[#5DA271]'
                            : r.status === 'Notice Period'
                              ? 'bg-[#FFF8E7] text-[#C9952A]'
                              : 'bg-[#F3F1EC] text-[#6B7280]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] font-number truncate">
                      {r.phone} · {r.id}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#2F3A35] font-number shrink-0">{r.rent}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#F3F1EC]">
                  <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> PG & room
                  </span>
                  <p className="font-semibold text-[#2F3A35] mt-0.5">
                    {r.pgName}
                  </p>
                  <p className="text-[#7B9D8A] font-semibold text-[11px] flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    {r.roomType} · {r.roomNumber}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#F3F1EC]">
                  <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Joined
                  </span>
                  <p className="font-semibold text-[#2F3A35] mt-0.5">{r.joinedDate}</p>
                  <p className="text-[11px] text-[#6B7280]">
                    Default rent day: {dayLabel(r.joinDay)} every month
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#D8C29B]">
                  <span className="text-[10px] text-[#6B7280] flex items-center gap-1 justify-between">
                    <span className="flex items-center gap-1">
                      <Bell className="w-3 h-3 text-[#7B9D8A]" /> Rent due / SMS day
                    </span>
                    {!isEditing && r.status !== 'Moved Out' && (
                      <button
                        type="button"
                        onClick={() => startEditPaymentDay(r)}
                        className="text-[#7B9D8A] font-bold inline-flex items-center gap-0.5"
                      >
                        <Pencil className="w-3 h-3" /> Change
                      </button>
                    )}
                  </span>

                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#2F3A35]">Every month on day</span>
                        <input
                          type="number"
                          min={1}
                          max={31}
                          value={editDay}
                          onChange={(e) => setEditDay(Number(e.target.value))}
                          className="w-16 px-2 py-1.5 rounded-xl border border-[#EAE8E4] bg-white font-number font-bold text-center"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => savePaymentDay(r.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#7B9D8A] text-white text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={() => resetToJoinDay(r)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-[#EAE8E4] text-[11px] font-bold"
                        >
                          Use join day
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-[#6B7280] inline-flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-bold text-[#2F3A35] mt-0.5">
                        {dayLabel(r.paymentDay)} of every month
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        Next: {nextPaymentLabel(r.paymentDay)}
                        {r.paymentDay !== r.joinDay ? ' · changed by you' : ''}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F3F1EC]">
                <button
                  type="button"
                  onClick={() => toggleSms(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                    r.smsReminders
                      ? 'bg-[#E8F5EC] text-[#5DA271] border-[#5DA271]/30'
                      : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  {r.smsReminders ? 'Auto SMS ON' : 'Auto SMS OFF'}
                </button>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${r.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-2 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35]"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => onOpenWhatsAppModal(r.phone, r.tenantName)}
                    className="px-3 py-1.5 rounded-xl bg-[#E8F5EC] text-[#25D366] font-bold text-xs hover:bg-[#D5F2DE] inline-flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredResidents.length === 0 && (
          <div className="p-10 text-center text-xs text-[#6B7280] bg-white rounded-[24px] border border-[#EAE8E4]">
            No residents match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};
