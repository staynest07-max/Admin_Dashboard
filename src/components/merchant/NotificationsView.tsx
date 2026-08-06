import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  CalendarDays, 
  AlertCircle, 
  Star, 
  CheckCheck,
  Trash2,
  Sparkles
} from 'lucide-react';
import { MerchantNotification } from '../../types/merchant';

interface NotificationsViewProps {
  notifications: MerchantNotification[];
  onMarkAllAsRead: () => void;
  onMarkSingleAsRead: (id: string) => void;
  onClearNotifications: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onMarkSingleAsRead,
  onClearNotifications
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === 'Unread') return !n.read;
    if (selectedFilter === 'Approvals') return n.type === 'Approval' || n.type === 'Rejection';
    if (selectedFilter === 'Enquiries') return n.type === 'Booking' || n.type === 'Complaint';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Approval':
        return <CheckCircle2 className="w-5 h-5 text-[#5DA271]" />;
      case 'Rejection':
        return <AlertCircle className="w-5 h-5 text-[#E56363]" />;
      case 'Booking':
        return <MessageSquare className="w-5 h-5 text-[#C9952A]" />;
      case 'Promotional':
        return <Star className="w-5 h-5 text-[#F4B740]" />;
      default:
        return <Bell className="w-5 h-5 text-[#6F9BD1]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3A35]">Merchant Notifications</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Stay informed about PG listing approvals, tenant enquiries, visit confirmations, and admin notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] font-semibold text-xs hover:bg-[#DDE9E0]"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}

          <button
            onClick={onClearNotifications}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#6B7280] hover:text-[#E56363] font-semibold text-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-3 shadow-soft-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['All', 'Unread', 'Approvals', 'Enquiries'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === filter
                ? 'bg-[#7B9D8A] text-white shadow-soft-sm'
                : 'bg-[#FFFFFF] text-[#6B7280] border border-[#EAE8E4] hover:bg-[#F3F1EC]'
            }`}
          >
            {filter} {filter === 'Unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-12 text-center shadow-soft-sm">
            <Bell className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#2F3A35]">No notifications</h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
              You are all caught up! New alerts will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((ntf) => (
            <div
              key={ntf.id}
              onClick={() => onMarkSingleAsRead(ntf.id)}
              className={`p-4 rounded-[24px] border transition-all cursor-pointer flex items-start gap-3.5 ${
                !ntf.read
                  ? 'bg-white border-[#D8C29B] shadow-soft-sm'
                  : 'bg-[#FFFFFF] border-[#EAE8E4] opacity-80'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] shrink-0 mt-0.5">
                {getNotificationIcon(ntf.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-bold ${!ntf.read ? 'text-[#2F3A35]' : 'text-[#2F3A35]'}`}>
                    {ntf.title}
                  </h3>
                  <span className="text-[11px] text-[#6B7280] font-number shrink-0">{ntf.sentAt}</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{ntf.message}</p>
              </div>

              {!ntf.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#7B9D8A] shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
