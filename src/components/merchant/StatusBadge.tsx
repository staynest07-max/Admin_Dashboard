import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, XCircle, Ban, CheckCircle, HelpCircle } from 'lucide-react';
import { MerchantStatus } from '../../types/merchant';

interface StatusBadgeProps {
  status: MerchantStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  let bgColor = 'bg-[#F3F1EC]';
  let textColor = 'text-[#6B7280]';
  let borderColor = 'border-[#EAE8E4]';
  let IconComponent = HelpCircle;

  switch (status) {
    case 'Verified':
      bgColor = 'bg-[#E8F5EC]';
      textColor = 'text-[#2E7D32]';
      borderColor = 'border-[#5DA271]/30';
      IconComponent = CheckCircle;
      break;
    case 'Pending Verification':
      bgColor = 'bg-[#FFF8E7]';
      textColor = 'text-[#CC8B00]';
      borderColor = 'border-[#F4B740]/30';
      IconComponent = Clock;
      break;
    case 'Changes Requested':
      bgColor = 'bg-[#DDE9E0]';
      textColor = 'text-[#7B9D8A]';
      borderColor = 'border-[#D8C29B]';
      IconComponent = AlertTriangle;
      break;
    case 'Suspended':
      bgColor = 'bg-[#FDECEC]';
      textColor = 'text-[#C62828]';
      borderColor = 'border-[#E56363]/30';
      IconComponent = AlertTriangle;
      break;
    case 'Blocked':
      bgColor = 'bg-[#F3F2F1]';
      textColor = 'text-[#343230]';
      borderColor = 'border-[#9CA3AF]';
      IconComponent = Ban;
      break;
    case 'Rejected':
      bgColor = 'bg-[#FDECEC]';
      textColor = 'text-[#C62828]';
      borderColor = 'border-[#E56363]/30';
      IconComponent = XCircle;
      break;
    default:
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'lg' ? 'px-3.5 py-1.5 text-xs font-semibold' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bgColor} ${textColor} ${borderColor} ${paddingClass} font-medium`}>
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{status}</span>
    </span>
  );
};
