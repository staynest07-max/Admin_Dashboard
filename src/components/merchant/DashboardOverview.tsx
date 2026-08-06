import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Bed, 
  MessageSquare, 
  CalendarDays, 
  Star, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PGListing, EnquiryItem, VisitItem, MerchantReview, DashboardTab } from '../../types/merchant';

interface DashboardOverviewProps {
  merchantName: string;
  pgListings: PGListing[];
  enquiries: EnquiryItem[];
  visits: VisitItem[];
  reviews: MerchantReview[];
  onSelectTab: (tab: DashboardTab) => void;
  onOpenScheduleVisitModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  merchantName,
  pgListings,
  enquiries,
  visits,
  reviews,
  onSelectTab,
  onOpenScheduleVisitModal,
}) => {
  // Calculations
  const totalPGs = pgListings.length;
  const livePGs = pgListings.filter((p) => p.status === 'Live').length;
  const pendingApproval = pgListings.filter((p) => p.status === 'Under Review').length;
  const draftListings = pgListings.filter((p) => p.status === 'Draft').length;
  
  const totalAvailableBeds = pgListings.reduce((acc, p) => acc + (p.availableBeds || 0), 0);
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'NEW').length;
  const upcomingVisitsCount = visits.filter((v) => v.category === 'Today' || v.category === 'Upcoming').length;
  
  const validReviews = reviews.filter((r) => r.rating > 0);
  const avgRating = validReviews.length > 0 
    ? (validReviews.reduce((acc, r) => acc + r.rating, 0) / validReviews.length).toFixed(1)
    : '4.8';

  const summaryCards = [
    {
      label: 'Total PGs',
      value: totalPGs,
      icon: Building2,
      color: 'bg-[#DDE9E0] text-[#7B9D8A] border-[#D8C29B]',
      tab: 'my-pgs' as DashboardTab,
      badge: 'All Listings'
    },
    {
      label: 'Live PGs',
      value: livePGs,
      icon: CheckCircle2,
      color: 'bg-[#E8F5EC] text-[#5DA271] border-[#5DA271]/30',
      tab: 'my-pgs' as DashboardTab,
      badge: 'Active & Searchable'
    },
    {
      label: 'Pending Approval',
      value: pendingApproval,
      icon: Clock,
      color: 'bg-[#FFF8E7] text-[#CC8B00] border-[#F4B740]/40',
      tab: 'my-pgs' as DashboardTab,
      badge: 'Admin Review'
    },
    {
      label: 'Draft Listings',
      value: draftListings,
      icon: FileEdit,
      color: 'bg-[#F3F1EC] text-[#6B7280] border-[#EAE8E4]',
      tab: 'my-pgs' as DashboardTab,
      badge: 'In Progress'
    },
    {
      label: 'Available Beds',
      value: totalAvailableBeds,
      icon: Bed,
      color: 'bg-[#E8F1FA] text-[#6F9BD1] border-[#6F9BD1]/30',
      tab: 'availability' as DashboardTab,
      badge: 'Ready to Occupy'
    },
    {
      label: 'New Enquiries',
      value: newEnquiriesCount,
      icon: MessageSquare,
      color: 'bg-[#FFF5E8] text-[#C9952A] border-[#C9952A]/30',
      tab: 'enquiries' as DashboardTab,
      badge: 'Needs Response'
    },
    {
      label: 'Upcoming Visits',
      value: upcomingVisitsCount,
      icon: CalendarDays,
      color: 'bg-[#DDE9E0] text-[#7B9D8A] border-[#D8C29B]',
      tab: 'visits' as DashboardTab,
      badge: 'Scheduled'
    },
    {
      label: 'Average Rating',
      value: `${avgRating} ⭐`,
      icon: Star,
      color: 'bg-[#FFF8E7] text-[#F4B740] border-[#F4B740]/40',
      tab: 'reviews' as DashboardTab,
      badge: `${reviews.length} Reviews`
    },
  ];

  // Recent activities feed
  const recentActivities = [
    {
      id: 'act-1',
      text: 'New enquiry received from Rahul Sharma for Sunrise Women’s PG',
      time: '10 mins ago',
      type: 'enquiry',
      icon: MessageSquare,
      color: 'bg-[#FFF5E8] text-[#C9952A]'
    },
    {
      id: 'act-2',
      text: 'PG "Sunrise Women’s PG" approved by Admin and is now LIVE',
      time: '1 hour ago',
      type: 'approval',
      icon: CheckCircle2,
      color: 'bg-[#E8F5EC] text-[#5DA271]'
    },
    {
      id: 'act-3',
      text: 'Visit scheduled with Ananya Verma for Today at 4:00 PM',
      time: '3 hours ago',
      type: 'visit',
      icon: CalendarDays,
      color: 'bg-[#E8F1FA] text-[#6F9BD1]'
    },
    {
      id: 'act-4',
      text: 'New ⭐⭐⭐⭐⭐ 5-star review added by Deepika Sundaram',
      time: '1 day ago',
      type: 'review',
      icon: Star,
      color: 'bg-[#FFF8E7] text-[#F4B740]'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FAF8F4] via-[#DDE9E0] to-[#FAF8F4] border border-[#D8C29B] rounded-3xl p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#7B9D8A] text-xs font-semibold border border-[#D8C29B] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PG Owner Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2F3A35] tracking-tight">
            Good Morning, {merchantName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Here is a quick overview of your PG listings, enquiries, and tenant visit schedules today.
          </p>
        </div>

        {/* Primary Call To Action */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectTab('add-pg')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#7B9D8A] text-white font-semibold text-xs hover:bg-[#6D8F7D] transition-all shadow-soft-md active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New PG</span>
          </button>
          <button
            onClick={() => onSelectTab('availability')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#7B9D8A] border border-[#7B9D8A] font-semibold text-xs hover:bg-[#DDE9E0] transition-all active:scale-[0.98]"
          >
            <Bed className="w-4 h-4" />
            <span>Update Availability</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2F3A35] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#7B9D8A]" />
            <span>Dashboard Overview</span>
          </h2>
          <span className="text-xs text-[#6B7280]">Real-time Status</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={() => onSelectTab(card.tab)}
                className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group hover:border-[#D8C29B]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-[#6B7280] bg-[#FFFFFF] border border-[#EAE8E4] px-2 py-0.5 rounded-full">
                    {card.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-[#6B7280] font-medium">{card.label}</p>
                  <p className="text-2xl font-extrabold text-[#2F3A35] font-number tracking-tight group-hover:text-[#7B9D8A] transition-colors">
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Split: Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#EAE8E4] rounded-[24px] p-6 shadow-soft-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#F3F1EC]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#DDE9E0] text-[#7B9D8A]">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-[#2F3A35]">Recent Activities</h3>
            </div>
            <button
              onClick={() => onSelectTab('notifications')}
              className="text-xs font-semibold text-[#7B9D8A] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#F3F1EC] hover:border-[#EAE8E4] transition-all"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#2F3A35] leading-snug">{act.text}</p>
                    <p className="text-[11px] text-[#6B7280] mt-1">{act.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Card (1 col) */}
        <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-6 shadow-soft-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#F3F1EC]">
              <div className="p-2 rounded-xl bg-[#DDE9E0] text-[#7B9D8A]">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-[#2F3A35]">Quick Actions</h3>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => onSelectTab('add-pg')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] font-semibold text-xs hover:bg-[#DDE9E0] hover:border-[#D8C29B] hover:text-[#7B9D8A] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-[#7B9D8A]" />
                  <span>+ Add New PG</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => onSelectTab('availability')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] font-semibold text-xs hover:bg-[#DDE9E0] hover:border-[#D8C29B] hover:text-[#7B9D8A] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Bed className="w-4 h-4 text-[#6F9BD1]" />
                  <span>+ Update Availability</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => onSelectTab('enquiries')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] font-semibold text-xs hover:bg-[#DDE9E0] hover:border-[#D8C29B] hover:text-[#7B9D8A] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#C9952A]" />
                  <span>+ View Enquiries</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => onSelectTab('my-pgs')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] font-semibold text-xs hover:bg-[#DDE9E0] hover:border-[#D8C29B] hover:text-[#7B9D8A] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#5DA271]" />
                  <span>+ Manage Listings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={onOpenScheduleVisitModal}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] font-semibold text-xs hover:bg-[#DDE9E0] hover:border-[#D8C29B] hover:text-[#7B9D8A] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-4 h-4 text-[#7B9D8A]" />
                  <span>+ Schedule Visit</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F3F1EC] text-center">
            <p className="text-[11px] text-[#6B7280]">Need help onboarding a property?</p>
            <p className="text-xs font-semibold text-[#7B9D8A] cursor-pointer hover:underline mt-0.5">
              Contact Merchant Support 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
