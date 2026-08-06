import React, { useState } from 'react';
import { X, Bell, Send, CheckCircle2 } from 'lucide-react';
import { MerchantNotification } from '../../types/merchant';

interface SendNotificationModalProps {
  isOpen: boolean;
  merchantName: string;
  onClose: () => void;
  onSendNotification: (notification: MerchantNotification) => void;
}

const TEMPLATES = [
  {
    type: 'Approval' as const,
    title: 'Profile & Documents Approved!',
    message: 'Your merchant profile and documents have been successfully verified by our onboarding team. You can now publish PG listings and receive tenant bookings.',
  },
  {
    type: 'Rejection' as const,
    title: 'Document Corrections Required',
    message: 'Your submitted documents require clarification or re-upload. Please log into your merchant portal and check the document verification tab.',
  },
  {
    type: 'Payment' as const,
    title: 'Payout Disbursed',
    message: 'Your monthly settlement has been processed and credited to your registered bank account. View your payout statement in the settlements section.',
  },
  {
    type: 'Complaint' as const,
    title: 'Action Required: Tenant Complaint Logged',
    message: 'A high-priority complaint regarding deposit refund withholding has been assigned to your account. Please respond within 48 hours to avoid penalty.',
  },
  {
    type: 'System' as const,
    title: 'Platform Maintenance Notice',
    message: 'Scheduled server maintenance will occur this Sunday between 02:00 AM and 04:00 AM IST. Booking services will remain unaffected.',
  },
];

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  isOpen,
  merchantName,
  onClose,
  onSendNotification,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<MerchantNotification['type']>('System');
  const [title, setTitle] = useState(TEMPLATES[4].title);
  const [message, setMessage] = useState(TEMPLATES[4].message);

  const handleSelectTemplate = (tpl: (typeof TEMPLATES)[0]) => {
    setType(tpl.type);
    setTitle(tpl.title);
    setMessage(tpl.message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif: MerchantNotification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      sentAt: 'Just now',
      read: false,
    };

    onSendNotification(newNotif);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F3A35]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[28px] max-w-lg w-full overflow-hidden shadow-soft-lg border border-[#EAE8E4] flex flex-col">
        <div className="p-5 border-b border-[#EAE8E4] bg-[#FFFFFF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDE9E0] text-[#7B9D8A] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2F3A35]">Send Merchant Notification</h3>
              <p className="text-xs text-[#6B7280]">Recipient: {merchantName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#6B7280] hover:bg-[#EAE8E4] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Preset Templates */}
          <div>
            <label className="text-xs text-[#6B7280] block mb-1.5 font-medium">Quick Notification Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition-all ${
                    title === tpl.title
                      ? 'bg-[#7B9D8A] text-white border-[#7B9D8A]'
                      : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4] hover:border-[#7B9D8A]'
                  }`}
                >
                  {tpl.type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] block mb-1 font-medium">Notification Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
            >
              <option value="Approval">Approval</option>
              <option value="Rejection">Rejection</option>
              <option value="Payment">Payment</option>
              <option value="Booking">Booking</option>
              <option value="Complaint">Complaint</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Promotional">Promotional</option>
              <option value="System">System</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] block mb-1 font-medium">Notification Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[#6B7280] block mb-1 font-medium">Message Details</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
              required
            />
          </div>

          <div className="pt-3 border-t border-[#EAE8E4] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6B7280] hover:bg-[#EAE8E4] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#7B9D8A] text-white rounded-xl hover:bg-[#6D8F7D] flex items-center gap-1.5 shadow-soft-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send Push Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
