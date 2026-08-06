import React, { useState } from 'react';
import { MessageSquare, Send, X, ExternalLink } from 'lucide-react';
import { EnquiryItem } from '../../types/merchant';

interface WhatsAppModalProps {
  isOpen: boolean;
  enquiry: EnquiryItem | null;
  onClose: () => void;
  onSentMessage: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  enquiry,
  onClose,
  onSentMessage
}) => {
  const defaultMsg = enquiry
    ? `Hi ${enquiry.tenantName}, thank you for your enquiry regarding ${enquiry.pgName} (${enquiry.roomType}). We have beds available for your move-in on ${enquiry.moveInDate}. When would you like to schedule a room visit?`
    : 'Hello, thank you for contacting Sunrise PG. How can we help you today?';

  const [message, setMessage] = useState(defaultMsg);

  if (!isOpen || !enquiry) return null;

  const handleSend = () => {
    // Open whatsapp URL
    const cleanPhone = enquiry.tenantPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    onSentMessage();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] max-w-md w-full p-6 shadow-soft-lg space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#6B7280] hover:text-[#2F3A35] rounded-xl hover:bg-[#F3F1EC]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-soft-sm">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#2F3A35]">Send WhatsApp Message</h3>
            <p className="text-xs text-[#6B7280]">To: {enquiry.tenantName} ({enquiry.tenantPhone})</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#2F3A35]">Message Content</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#25D366]"
          />
        </div>

        <button
          onClick={handleSend}
          className="w-full py-3 bg-[#25D366] text-white font-bold text-xs rounded-2xl hover:opacity-95 transition-all shadow-soft-sm flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Launch WhatsApp Chat</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
