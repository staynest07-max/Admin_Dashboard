import React from 'react';
import { 
  Building2, 
  Bed, 
  Plus, 
  PlusCircle, 
  Bell, 
  ChevronRight, 
  TrendingUp, 
  Users,
} from 'lucide-react';
import { PGListing, EnquiryItem, VisitItem, MerchantNotification, DashboardTab } from '../../types/merchant';

interface HomeDashboardViewProps {
  merchantName: string;
  pgListings: PGListing[];
  enquiries: EnquiryItem[];
  visits: VisitItem[];
  notifications: MerchantNotification[];
  onSelectTab: (tab: DashboardTab) => void;
  onOpenScheduleVisitModal: () => void;
  onOpenAddPG: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  merchantName,
  pgListings,
  enquiries,
  visits,
  notifications,
  onSelectTab,
  onOpenScheduleVisitModal,
  onOpenAddPG
}) => {
  // Time-based greeting
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Metrics
  const totalPGs = pgListings.length;
  const totalRooms = pgListings.reduce((acc, p) => acc + p.totalRooms, 0);
  const availableBeds = pgListings.reduce((acc, p) => acc + (p.availableBeds || 0), 0);
  const occupiedBeds = pgListings.reduce((acc, p) => {
    const total = p.totalBeds || 0;
    const available = p.availableBeds || 0;
    return acc + Math.max(total - available, 0);
  }, 0);
  const newEnquiries = enquiries.filter((e) => e.status === 'NEW').length;

  // Current residents sample list
  const recentResidentsList = [
    { id: 'RES-101', tenantName: 'Rohan Verma', roomType: '2 Sharing · Room 204', pgName: 'Green Residency', joined: '01 Mar 2026', rent: '$250', status: 'Staying' },
    { id: 'RES-102', tenantName: 'Ananya Sharma', roomType: 'Single · Room 102', pgName: "Sunrise Women's PG", joined: '15 Jan 2026', rent: '$350', status: 'Staying' },
    { id: 'RES-103', tenantName: 'Karthik Raja', roomType: '3 Sharing · Room 301', pgName: 'Urban Nest Co-Living', joined: '20 Feb 2026', rent: '$200', status: 'Notice Period' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#EAE8E4] rounded-[28px] p-6 shadow-soft-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2F3A35]">
            {greetingTime}, {merchantName} 👋
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Overview of your properties, current residents, and occupancy. Revenue lives in its own tab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddPG}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#7B9D8A] text-white font-bold text-xs hover:bg-[#6D8F7D] transition-all shadow-soft-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add PG</span>
          </button>
        </div>
      </div>

      {/* Business Summary Cards */}
      <div>
        <h2 className="text-sm font-bold text-[#2F3A35] uppercase tracking-wider mb-3">
          Business Summary
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total PGs */}
          <div 
            onClick={() => onSelectTab('my-pgs')}
            className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">Total PGs</span>
              <div className="p-2 rounded-xl bg-[#DDE9E0] text-[#7B9D8A] border border-[#D8C29B]">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#2F3A35] font-number mt-2">{totalPGs}</p>
            <span className="text-[11px] text-[#5DA271] font-semibold mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Active Listings
            </span>
          </div>

          {/* Total Rooms */}
          <div 
            onClick={() => onSelectTab('my-pgs')}
            className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">Total Rooms</span>
              <div className="p-2 rounded-xl bg-[#E8F1FA] text-[#6F9BD1] border border-[#6F9BD1]/30">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#2F3A35] font-number mt-2">{totalRooms}</p>
            <span className="text-[11px] text-[#6B7280] font-semibold mt-1 block">
              Across all properties
            </span>
          </div>

          {/* Residents */}
          <div 
            onClick={() => onSelectTab('residents')}
            className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">Residents</span>
              <div className="p-2 rounded-xl bg-[#E8F5EC] text-[#5DA271] border border-[#5DA271]/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#2F3A35] font-number mt-2">{occupiedBeds}</p>
            <span className="text-[11px] text-[#5DA271] font-semibold mt-1 inline-flex items-center gap-1">
              Beds currently occupied
            </span>
          </div>

          {/* Available Beds — replaces revenue on Home */}
          <div 
            onClick={() => onSelectTab('availability')}
            className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">Available Beds</span>
              <div className="p-2 rounded-xl bg-[#FFF8E7] text-[#C9952A] border border-[#C9952A]/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#2F3A35] font-number mt-2">{availableBeds}</p>
            <span className="text-[11px] text-[#6B7280] font-semibold mt-1 block">
              {newEnquiries} new enquiries waiting
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Current Residents & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Residents (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#EAE8E4] rounded-[28px] p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3F1EC]">
            <div>
              <h3 className="font-bold text-base text-[#2F3A35]">Current Residents</h3>
              <p className="text-xs text-[#6B7280]">People staying in your PGs right now</p>
            </div>
            <button
              onClick={() => onSelectTab('residents')}
              className="text-xs font-bold text-[#7B9D8A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentResidentsList.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#2F3A35]">{res.tenantName}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      res.status === 'Staying' ? 'bg-[#E8F5EC] text-[#5DA271]' : 'bg-[#FFF8E7] text-[#C9952A]'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {res.pgName} • <span className="text-[#7B9D8A] font-semibold">{res.roomType}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-[#2F3A35] font-number block">{res.rent}</span>
                  <span className="text-[11px] text-[#6B7280]">Joined: {res.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white border border-[#EAE8E4] rounded-[28px] p-6 shadow-soft-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#2F3A35] mb-1">Quick Actions</h3>
            <p className="text-xs text-[#6B7280]">Fast shortcuts to manage your properties</p>

            <div className="space-y-3 mt-4">
              <button
                onClick={onOpenAddPG}
                className="w-full p-4 rounded-2xl bg-[#FAF8F4] border border-[#D8C29B] text-left hover:bg-[#DDE9E0] transition-all flex items-center gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-[#7B9D8A] text-white shadow-soft-sm">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2F3A35]">+ Add PG Property</h4>
                  <p className="text-[11px] text-[#2F3A35]">List new PG or hostel on the platform</p>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('my-pgs')}
                className="w-full p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-left hover:bg-[#F3F1EC] transition-all flex items-center gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-[#E8F1FA] text-[#6F9BD1]">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#2F3A35]">+ Manage Rooms</h4>
                  <p className="text-[11px] text-[#6B7280]">Update bed counts or room pricing</p>
                </div>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F3F1EC] border border-[#EAE8E4] text-xs text-[#6B7280] space-y-1">
            <span className="font-bold text-[#2F3A35] block">💡 Merchant Tip</span>
            <p className="text-[11px]">Keep bed availability updated daily to receive up to 3x more tenant walkthrough requests.</p>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3F1EC]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#7B9D8A]" />
            <h3 className="font-bold text-base text-[#2F3A35]">Recent Notifications</h3>
          </div>
          <button
            onClick={() => onSelectTab('notifications')}
            className="text-xs font-bold text-[#7B9D8A] hover:underline"
          >
            View All Notifications
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {notifications.slice(0, 4).map((ntf) => (
            <div
              key={ntf.id}
              onClick={() => onSelectTab('notifications')}
              className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] hover:border-[#D8C29B] transition-all cursor-pointer flex items-start gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-[#7B9D8A] shrink-0 mt-1.5" />
              <div>
                <h4 className="font-bold text-xs text-[#2F3A35]">{ntf.title}</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5 line-clamp-1">{ntf.message}</p>
                <span className="text-[10px] text-[#9CA3AF] font-number mt-1 block">{ntf.sentAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
