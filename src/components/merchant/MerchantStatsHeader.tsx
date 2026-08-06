import React from 'react';
import { Users, Building2, BedDouble, IndianRupee, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Merchant } from '../../types/merchant';

interface MerchantStatsHeaderProps {
  merchants: Merchant[];
  onSelectFilterStatus?: (status: string) => void;
}

export const MerchantStatsHeader: React.FC<MerchantStatsHeaderProps> = ({ merchants, onSelectFilterStatus }) => {
  const totalMerchants = merchants.length;
  const verifiedCount = merchants.filter((m) => m.basicInfo.accountStatus === 'Verified').length;
  const pendingCount = merchants.filter((m) => m.basicInfo.accountStatus === 'Pending Verification').length;
  const changesRequestedCount = merchants.filter((m) => m.basicInfo.accountStatus === 'Changes Requested').length;
  const suspendedCount = merchants.filter((m) => m.basicInfo.accountStatus === 'Suspended').length;

  const totalPGs = merchants.reduce((acc, m) => acc + m.businessInfo.totalPGs, 0);
  const totalRooms = merchants.reduce((acc, m) => acc + m.businessInfo.totalRooms, 0);
  const totalOccupied = merchants.reduce((acc, m) => acc + m.businessInfo.occupiedRooms, 0);
  const totalVacant = merchants.reduce((acc, m) => acc + m.businessInfo.vacantRooms, 0);

  const overallOccupancy = totalRooms > 0 ? ((totalOccupied / totalRooms) * 100).toFixed(1) : '0';

  const totalMonthlyRevenue = merchants.reduce((acc, m) => acc + m.metrics.monthlyRevenue, 0);
  const pendingPayouts = merchants.reduce((acc, m) => acc + m.bankDetails.pendingPayoutAmount, 0);

  const activeComplaints = merchants.reduce(
    (acc, m) => acc + m.complaints.filter((c) => c.status === 'Open' || c.status === 'In Progress').length,
    0
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {/* Card 1: Total Merchants */}
      <div 
        onClick={() => onSelectFilterStatus?.('All')}
        className="bg-white p-5 rounded-[24px] border border-[#EAE8E4] shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#6B7280]">Total Merchants</span>
          <div className="w-9 h-9 rounded-2xl bg-[#DDE9E0] text-[#7B9D8A] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#2F3A35] font-number">{totalMerchants}</span>
          <span className="text-xs font-medium text-[#5DA271] flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" />
            {verifiedCount} Verified
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#F3F1EC] flex items-center justify-between text-xs text-[#6B7280]">
          <span>{pendingCount} Pending Verification</span>
          {changesRequestedCount > 0 && (
            <span className="text-[#D99A73] font-medium">{changesRequestedCount} Action Req</span>
          )}
        </div>
      </div>

      {/* Card 2: PG Listings & Capacity */}
      <div className="bg-white p-5 rounded-[24px] border border-[#EAE8E4] shadow-soft-sm hover:shadow-soft-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#6B7280]">Properties & Occupancy</span>
          <div className="w-9 h-9 rounded-2xl bg-[#E8F1FA] text-[#6F9BD1] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#2F3A35] font-number">{totalPGs}</span>
          <span className="text-xs text-[#6B7280]">Live PGs</span>
          <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F5EC] text-[#2E7D32]">
            {overallOccupancy}% Full
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#F3F1EC] flex items-center justify-between text-xs text-[#6B7280]">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-[#6B7280]" />
            {totalOccupied} Occupied
          </span>
          <span className="text-[#C47A55] font-medium">{totalVacant} Vacant</span>
        </div>
      </div>

      {/* Card 3: Monthly Revenue & Pending Payouts */}
      <div className="bg-white p-5 rounded-[24px] border border-[#EAE8E4] shadow-soft-sm hover:shadow-soft-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#6B7280]">Monthly Revenue</span>
          <div className="w-9 h-9 rounded-2xl bg-[#E8F5EC] text-[#5DA271] flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#2F3A35] font-number">
            ₹{(totalMonthlyRevenue / 100000).toFixed(2)}L
          </span>
          <span className="text-xs text-[#6B7280]">/ mo</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#F3F1EC] flex items-center justify-between text-xs text-[#6B7280]">
          <span className="text-[#6B7280]">Pending Settlement:</span>
          <span className="font-semibold text-[#7B9D8A] font-number">
            ₹{pendingPayouts.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Card 4: Action Needed & Active Complaints */}
      <div 
        onClick={() => onSelectFilterStatus?.(suspendedCount > 0 ? 'Suspended' : 'All')}
        className="bg-white p-5 rounded-[24px] border border-[#EAE8E4] shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#6B7280]">Risk & Complaints</span>
          <div className="w-9 h-9 rounded-2xl bg-[#FFF8E7] text-[#F4B740] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#2F3A35] font-number">{activeComplaints}</span>
          <span className="text-xs text-[#E56363] font-medium">Open Disputes</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#F3F1EC] flex items-center justify-between text-xs text-[#6B7280]">
          <span>Suspended Merchants:</span>
          <span className="font-semibold text-[#E56363] font-number">{suspendedCount}</span>
        </div>
      </div>
    </div>
  );
};
