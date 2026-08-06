import React from 'react';
import { Building2, MapPin, Phone, Mail, Star, IndianRupee, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { Merchant } from '../../types/merchant';
import { StatusBadge } from './StatusBadge';

interface MerchantCardGridProps {
  merchants: Merchant[];
  onSelectMerchant: (merchant: Merchant) => void;
  onQuickApprove: (merchant: Merchant, e: React.MouseEvent) => void;
  onQuickSuspend: (merchant: Merchant, e: React.MouseEvent) => void;
}

export const MerchantCardGrid: React.FC<MerchantCardGridProps> = ({
  merchants,
  onSelectMerchant,
  onQuickApprove,
  onQuickSuspend,
}) => {
  if (merchants.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#EAE8E4] p-12 text-center shadow-soft-sm my-6">
        <div className="w-16 h-16 bg-[#DDE9E0] text-[#7B9D8A] rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg text-[#2F3A35] mb-1">No Merchants Found</h3>
        <p className="text-sm text-[#6B7280] max-w-md mx-auto">
          No merchant records match your active search and filter parameters. Try resetting your search query or selecting a different status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      {merchants.map((merchant) => {
        const { basicInfo, businessInfo, metrics, verificationStatus } = merchant;

        return (
          <div
            key={merchant.id}
            onClick={() => onSelectMerchant(merchant)}
            className="bg-white rounded-[24px] border border-[#EAE8E4] shadow-soft-sm hover:shadow-soft-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
          >
            {/* Card Top: Profile Header */}
            <div className="p-5 border-b border-[#F3F1EC]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={basicInfo.profilePhoto}
                      alt={basicInfo.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#EAE8E4]"
                    />
                    {businessInfo.businessLogo && (
                      <img
                        src={businessInfo.businessLogo}
                        alt="Logo"
                        className="w-5 h-5 rounded-md object-cover absolute -bottom-1 -right-1 border border-white"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2F3A35] group-hover:text-[#7B9D8A] transition-colors leading-tight">
                      {basicInfo.fullName}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">{businessInfo.businessName}</p>
                    <span className="text-[10px] text-[#9CA3AF] font-mono">{basicInfo.merchantId}</span>
                  </div>
                </div>

                <StatusBadge status={basicInfo.accountStatus} size="sm" />
              </div>

              {/* City & Contact Info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B7280] mt-3 pt-2.5 border-t border-[#F3F1EC]">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#7B9D8A]" />
                  {basicInfo.city}, {basicInfo.state}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
                  {basicInfo.mobileNumber}
                </span>
              </div>
            </div>

            {/* Verification Checklist Pills */}
            <div className="px-5 py-3 bg-[#FFFFFF] border-b border-[#F3F1EC] flex items-center justify-between text-[11px]">
              <span className="text-[#6B7280]">Verification Docs:</span>
              <div className="flex items-center gap-1.5">
                <span
                  title="PAN Card"
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    verificationStatus.panVerified
                      ? 'bg-[#E8F5EC] text-[#2E7D32]'
                      : 'bg-[#FDECEC] text-[#C62828]'
                  }`}
                >
                  PAN
                </span>
                <span
                  title="Aadhaar ID"
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    verificationStatus.aadhaarVerified
                      ? 'bg-[#E8F5EC] text-[#2E7D32]'
                      : 'bg-[#FFF8E7] text-[#CC8B00]'
                  }`}
                >
                  Aadhaar
                </span>
                <span
                  title="GST Certificate"
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    verificationStatus.gstVerified
                      ? 'bg-[#E8F5EC] text-[#2E7D32]'
                      : 'bg-[#F3F2F1] text-[#6B7280]'
                  }`}
                >
                  GST
                </span>
                <span
                  title="Bank Account"
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    verificationStatus.bankVerified
                      ? 'bg-[#E8F5EC] text-[#2E7D32]'
                      : 'bg-[#FFF8E7] text-[#CC8B00]'
                  }`}
                >
                  Bank
                </span>
              </div>
            </div>

            {/* Key Business Stats */}
            <div className="p-5 bg-white grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4]">
                <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Properties</span>
                <span className="text-sm font-bold text-[#2F3A35] font-number mt-0.5 block">
                  {businessInfo.totalPGs} PGs
                </span>
                <span className="text-[10px] text-[#6B7280] block">{businessInfo.totalRooms} Rooms</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4]">
                <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Monthly Rev</span>
                <span className="text-sm font-bold text-[#5DA271] font-number mt-0.5 block">
                  ₹{(metrics.monthlyRevenue / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-[#6B7280] block">{metrics.occupancyRate}% Occupied</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4]">
                <span className="text-[10px] text-[#6B7280] block uppercase font-medium">Rating</span>
                <span className="text-sm font-bold text-[#2F3A35] font-number mt-0.5 flex items-center justify-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#F4B740] text-[#F4B740]" />
                  {metrics.averageRating > 0 ? metrics.averageRating : 'New'}
                </span>
                <span className="text-[10px] text-[#6B7280] block">
                  {merchant.reviews.length} Reviews
                </span>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="px-5 py-3.5 bg-[#FFFFFF] border-t border-[#EAE8E4] flex items-center justify-between gap-2">
              {/* Quick Action Button depending on status */}
              {basicInfo.accountStatus === 'Pending Verification' ? (
                <button
                  onClick={(e) => onQuickApprove(merchant, e)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#E8F5EC] text-[#2E7D32] hover:bg-[#5DA271] hover:text-white transition-all flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Now
                </button>
              ) : basicInfo.accountStatus === 'Verified' ? (
                <button
                  onClick={(e) => onQuickSuspend(merchant, e)}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl text-[#C62828] hover:bg-[#FDECEC] transition-all flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Suspend
                </button>
              ) : (
                <span className="text-xs text-[#6B7280]">Reg: {basicInfo.registrationDate}</span>
              )}

              <button
                onClick={() => onSelectMerchant(merchant)}
                className="flex items-center gap-1 text-xs font-semibold text-[#7B9D8A] hover:text-[#874C33] group-hover:translate-x-0.5 transition-all"
              >
                <span>View Full Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
