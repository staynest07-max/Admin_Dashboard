import React from 'react';
import { Building2, Eye, CheckCircle2, AlertTriangle, ChevronRight, Phone, Mail } from 'lucide-react';
import { Merchant } from '../../types/merchant';
import { StatusBadge } from './StatusBadge';

interface MerchantTableProps {
  merchants: Merchant[];
  onSelectMerchant: (merchant: Merchant) => void;
  onQuickApprove: (merchant: Merchant, e: React.MouseEvent) => void;
  onQuickSuspend: (merchant: Merchant, e: React.MouseEvent) => void;
}

export const MerchantTable: React.FC<MerchantTableProps> = ({
  merchants,
  onSelectMerchant,
  onQuickApprove,
  onQuickSuspend,
}) => {
  if (merchants.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-[#EAE8E4] p-12 text-center shadow-soft-sm my-6">
        <Building2 className="w-10 h-10 text-[#7B9D8A] mx-auto mb-3" />
        <p className="text-sm text-[#6B7280]">No merchant records found matching your active filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#EAE8E4] shadow-soft-sm overflow-hidden my-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFFFFF] border-b border-[#EAE8E4] text-[#6B7280] font-medium uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Merchant Name</th>
              <th className="py-3.5 px-4">Business Info</th>
              <th className="py-3.5 px-4">City</th>
              <th className="py-3.5 px-4">Properties</th>
              <th className="py-3.5 px-4">Monthly Rev</th>
              <th className="py-3.5 px-4">Docs Verified</th>
              <th className="py-3.5 px-4">Account Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F1EC] text-[#2F3A35]">
            {merchants.map((merchant) => {
              const { basicInfo, businessInfo, metrics, documents } = merchant;
              const verifiedDocsCount = documents.filter((d) => d.status === 'Verified').length;
              const totalDocs = documents.length;

              return (
                <tr
                  key={merchant.id}
                  onClick={() => onSelectMerchant(merchant)}
                  className="hover:bg-[#FAF8F4] transition-colors cursor-pointer group"
                >
                  {/* Merchant Name & ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={basicInfo.profilePhoto}
                        alt={basicInfo.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-[#EAE8E4]"
                      />
                      <div>
                        <div className="font-semibold text-sm text-[#2F3A35] group-hover:text-[#7B9D8A] transition-colors">
                          {basicInfo.fullName}
                        </div>
                        <div className="text-[11px] text-[#6B7280] font-mono">{basicInfo.merchantId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Business Info */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#2F3A35]">{businessInfo.businessName}</div>
                    <div className="text-[11px] text-[#6B7280]">{businessInfo.businessType}</div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 font-medium text-[#6B7280]">
                    {basicInfo.city}, {basicInfo.state}
                  </td>

                  {/* Properties & Occupancy */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#2F3A35] font-number">{businessInfo.totalPGs} PGs</div>
                    <div className="text-[11px] text-[#6B7280] font-number">
                      {businessInfo.occupiedRooms}/{businessInfo.totalRooms} Rooms ({metrics.occupancyRate}%)
                    </div>
                  </td>

                  {/* Monthly Revenue */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#5DA271] font-number">
                      ₹{metrics.monthlyRevenue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      Pending: ₹{merchant.bankDetails.pendingPayoutAmount.toLocaleString('en-IN')}
                    </div>
                  </td>

                  {/* Document Verification */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-[#EAE8E4] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#5DA271] h-full transition-all"
                          style={{
                            width: `${totalDocs > 0 ? (verifiedDocsCount / totalDocs) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#6B7280] font-number">
                        {verifiedDocsCount}/{totalDocs}
                      </span>
                    </div>
                  </td>

                  {/* Account Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={basicInfo.accountStatus} size="sm" />
                  </td>

                  {/* Quick Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {basicInfo.accountStatus === 'Pending Verification' && (
                        <button
                          onClick={(e) => onQuickApprove(merchant, e)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#E8F5EC] text-[#2E7D32] hover:bg-[#5DA271] hover:text-white transition-all flex items-center gap-1"
                          title="Quick Approve Merchant"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}

                      {basicInfo.accountStatus === 'Verified' && (
                        <button
                          onClick={(e) => onQuickSuspend(merchant, e)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg text-[#C62828] hover:bg-[#FDECEC] transition-all flex items-center gap-1"
                          title="Suspend Merchant"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Suspend
                        </button>
                      )}

                      <button
                        onClick={() => onSelectMerchant(merchant)}
                        className="p-1.5 text-[#7B9D8A] hover:bg-[#DDE9E0] rounded-lg transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
