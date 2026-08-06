import React, { useState } from 'react';
import {
  Building2,
  LayoutDashboard,
  Home,
  PlusCircle,
  CalendarCheck,
  DollarSign,
  Bed,
  Star,
  Bell,
  Users,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { DashboardTab } from '../../types/merchant';

interface HeaderProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  unreadNotificationsCount: number;
  newEnquiriesCount: number;
  upcomingVisitsCount: number;
  merchantName: string;
  businessName: string;
  profilePhoto: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  onRestartOnboarding?: () => void;
}

type NavItem = {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
  newEnquiriesCount,
  upcomingVisitsCount,
  merchantName,
  businessName,
  profilePhoto,
  isLoggedIn,
  onLogout,
  onRestartOnboarding,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryNav: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'my-pgs', label: 'My PGs', icon: Home },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'earnings', label: 'Money', icon: DollarSign },
  ];

  const secondaryNav: NavItem[] = [
    { id: 'add-pg', label: 'Add PG', icon: PlusCircle, highlight: true },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, badge: newEnquiriesCount },
    { id: 'visits', label: 'Visits', icon: CalendarCheck, badge: upcomingVisitsCount },
    { id: 'availability', label: 'Availability', icon: Bed },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
  ];

  const desktopNav: NavItem[] = [
    ...primaryNav,
    { id: 'add-pg', label: 'Add PG', icon: PlusCircle, highlight: true },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, badge: newEnquiriesCount },
    { id: 'visits', label: 'Visits', icon: CalendarCheck, badge: upcomingVisitsCount },
    { id: 'availability', label: 'Availability', icon: Bed },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  const isPrimaryActive = primaryNav.some((n) => n.id === activeTab);
  const isMoreActive = secondaryNav.some((n) => n.id === activeTab);
  const isProfileActive = activeTab === 'profile';

  const selectTab = (tab: DashboardTab) => {
    setMoreOpen(false);
    onSelectTab(tab);
  };

  const renderNavButton = (item: NavItem, compact = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'home');
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => selectTab(item.id)}
        className={`flex items-center gap-2 rounded-2xl text-xs font-medium transition-all ${
          compact ? 'flex-col gap-0.5 px-2 py-1.5 min-w-[56px]' : 'px-3.5 py-2'
        } ${
          isActive
            ? compact
              ? 'text-[#7B9D8A]'
              : 'bg-[#7B9D8A] text-white shadow-soft-sm font-semibold'
            : item.highlight
              ? compact
                ? 'text-[#7B9D8A]'
                : 'bg-[#DDE9E0] text-[#7B9D8A] border border-[#D8C29B] hover:bg-[#DDE9E0]'
              : compact
                ? 'text-[#6B7280]'
                : 'text-[#6B7280] hover:text-[#2F3A35] hover:bg-[#F3F1EC]'
        }`}
      >
        <span className="relative">
          <Icon className={`${compact ? 'w-5 h-5' : 'w-4 h-4'}`} />
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#E56363] text-white text-[9px] font-bold flex items-center justify-center font-number">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          )}
        </span>
        <span className={compact ? 'text-[10px] font-semibold leading-tight' : ''}>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#EAE8E4] shadow-soft-sm">
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#7B9D8A] flex items-center justify-center text-white shadow-soft-sm shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-[#2F3A35] tracking-tight truncate">
                  StayNest
                </h1>
                <span className="hidden xs:inline text-[10px] font-bold bg-[#DDE9E0] text-[#7B9D8A] border border-[#D8C29B] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Merchant
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] truncate sm:text-xs">
                {businessName || 'Merchant Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onRestartOnboarding && (
              <button
                type="button"
                onClick={onRestartOnboarding}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FAF8F4] border border-[#D8C29B] text-[#7B9D8A] hover:bg-[#DDE9E0] transition-all text-xs font-bold"
              >
                Onboarding
              </button>
            )}

            <button
              type="button"
              onClick={() => selectTab('notifications')}
              className="relative p-2 sm:p-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] hover:text-[#7B9D8A] hover:border-[#D8C29B] transition-all"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E56363] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white font-number">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isLoggedIn && (
              <div className="flex items-center gap-1.5 sm:gap-3 sm:pl-2 sm:border-l sm:border-[#EAE8E4]">
                <button
                  type="button"
                  onClick={() => selectTab('profile')}
                  title="My Profile"
                  className={`flex items-center gap-2 p-1 sm:pr-3 rounded-2xl transition-all text-left ${
                    isProfileActive
                      ? 'bg-[#DDE9E0] ring-2 ring-[#7B9D8A]/40'
                      : 'hover:bg-[#DDE9E0]'
                  }`}
                >
                  <img
                    src={profilePhoto}
                    alt={merchantName}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border ${
                      isProfileActive ? 'border-[#7B9D8A]' : 'border-[#D8C29B]'
                    }`}
                  />
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-[#2F3A35] leading-tight">{merchantName}</p>
                    <p className="text-[11px] text-[#6B7280] truncate max-w-[120px]">Profile</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="hidden md:flex p-2 text-[#6B7280] hover:text-[#E56363] hover:bg-[#FDECEC] rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-8 border-t border-[#F3F1EC]">
          <nav className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
            {desktopNav.map((item) => renderNavButton(item))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#EAE8E4] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-stretch justify-around px-1 py-1">
          {primaryNav.map((item) => renderNavButton(item, true))}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-[56px] rounded-2xl text-[10px] font-semibold ${
              isMoreActive && !isPrimaryActive ? 'text-[#7B9D8A]' : 'text-[#6B7280]'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Mobile More sheet */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-[28px] border border-[#EAE8E4] shadow-soft-lg p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#2F3A35]">More</h3>
                <p className="text-xs text-[#6B7280]">All merchant tools</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-2 rounded-xl bg-[#F3F1EC] text-[#6B7280]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTab(item.id)}
                    className={`relative flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all ${
                      isActive
                        ? 'bg-[#7B9D8A] text-white border-[#7B9D8A]'
                        : item.highlight
                          ? 'bg-[#DDE9E0] text-[#7B9D8A] border-[#D8C29B]'
                          : 'bg-[#FFFFFF] text-[#2F3A35] border-[#EAE8E4]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center font-number ${
                          isActive ? 'bg-white text-[#7B9D8A]' : 'bg-[#E56363] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#F5C4C4] bg-[#FFF8F8] text-[#E56363] font-semibold text-sm hover:bg-[#FDECEC] transition-all"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
