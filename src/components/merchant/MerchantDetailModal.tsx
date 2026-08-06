import React, { useState } from 'react';
import {
  X, User, Building2, ShieldCheck, FileText, CreditCard, Building, BedDouble,
  Calendar, IndianRupee, Star, AlertTriangle, Bell, Clock, Lock, CheckCircle2,
  XCircle, Ban, Send, RefreshCw, Eye, Plus, MessageSquare, ShieldAlert,
  Edit2, Trash2, Key, ChevronRight, Phone, Mail, MapPin, ExternalLink
} from 'lucide-react';
import { Merchant, MerchantDocument, DocumentStatus, MerchantStatus, MerchantNotification } from '../../types/merchant';
import { StatusBadge } from './StatusBadge';

interface MerchantDetailModalProps {
  merchant: Merchant | null;
  onClose: () => void;
  onUpdateMerchantStatus: (merchantId: string, newStatus: MerchantStatus, reason?: string) => void;
  onUpdateDocumentStatus: (merchantId: string, docId: string, status: DocumentStatus, reason?: string) => void;
  onOpenDocumentViewer: (doc: MerchantDocument) => void;
  onOpenSendNotification: (merchant: Merchant) => void;
  onResolveComplaint: (merchantId: string, complaintId: string, notes: string) => void;
  onTogglePermission: (merchantId: string, permKey: keyof Merchant['permissions']) => void;
}

type TabType =
  | 'basic_business'
  | 'verification_documents'
  | 'pg_listings'
  | 'bookings'
  | 'revenue_payouts'
  | 'reviews'
  | 'complaints'
  | 'notifications'
  | 'activity_audit'
  | 'admin_actions';

export const MerchantDetailModal: React.FC<MerchantDetailModalProps> = ({
  merchant,
  onClose,
  onUpdateMerchantStatus,
  onUpdateDocumentStatus,
  onOpenDocumentViewer,
  onOpenSendNotification,
  onResolveComplaint,
  onTogglePermission,
}) => {
  if (!merchant) return null;

  const [activeTab, setActiveTab] = useState<TabType>('basic_business');
  const [statusReason, setStatusReason] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const { basicInfo, businessInfo, verificationStatus, documents, bankDetails, pgListings, recentBookings, settlements, reviews, complaints, notifications, activityLogs, metrics, permissions } = merchant;

  const handleApprove = () => {
    onUpdateMerchantStatus(merchant.id, 'Verified');
  };

  const handleSuspend = () => {
    const reason = statusReason || 'Account suspended by admin due to policy review.';
    onUpdateMerchantStatus(merchant.id, 'Suspended', reason);
  };

  const handleRequestChanges = () => {
    const reason = statusReason || 'Please review and update your uploaded legal documents and bank details.';
    onUpdateMerchantStatus(merchant.id, 'Changes Requested', reason);
  };

  const handleReactivate = () => {
    onUpdateMerchantStatus(merchant.id, 'Verified');
  };

  const handleBlock = () => {
    onUpdateMerchantStatus(merchant.id, 'Blocked', statusReason || 'Account permanently blocked for terms violation.');
  };

  const handleResolveComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintId || !resolutionNotes.trim()) return;
    onResolveComplaint(merchant.id, selectedComplaintId, resolutionNotes);
    setSelectedComplaintId(null);
    setResolutionNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F3A35]/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-[28px] max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-soft-lg border border-[#EAE8E4] flex flex-col">
        {/* Top Header Card */}
        <div className="p-5 sm:p-6 border-b border-[#EAE8E4] bg-[#FAF8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={basicInfo.profilePhoto}
                alt={basicInfo.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-soft-sm"
              />
              {businessInfo.businessLogo && (
                <img
                  src={businessInfo.businessLogo}
                  alt="Logo"
                  className="w-6 h-6 rounded-md object-cover absolute -bottom-1 -right-1 border border-white"
                />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-xl text-[#2F3A35]">{basicInfo.fullName}</h2>
                <StatusBadge status={basicInfo.accountStatus} size="sm" />
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
                {businessInfo.businessName} • <span className="font-mono text-[#7B9D8A]">{basicInfo.merchantId}</span>
              </p>
              <p className="text-[11px] text-[#6B7280] mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#7B9D8A]" />{basicInfo.city}, {basicInfo.state}</span>
                <span>• Reg: {basicInfo.registrationDate}</span>
                <span>• Last Login: {basicInfo.lastLogin}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {basicInfo.accountStatus === 'Pending Verification' && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-semibold bg-[#5DA271] text-white rounded-xl hover:bg-[#2E7D32] shadow-soft-sm flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Merchant
              </button>
            )}

            {basicInfo.accountStatus === 'Verified' && (
              <button
                onClick={() => setActiveTab('admin_actions')}
                className="px-3.5 py-2 text-xs font-medium text-[#C62828] bg-[#FDECEC] border border-[#E56363]/20 rounded-xl hover:bg-[#E56363] hover:text-white transition-all flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Suspend Account
              </button>
            )}

            {basicInfo.accountStatus === 'Suspended' && (
              <button
                onClick={handleReactivate}
                className="px-4 py-2 text-xs font-semibold bg-[#5DA271] text-white rounded-xl hover:bg-[#2E7D32] transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Reactivate Account
              </button>
            )}

            <button
              onClick={() => onOpenSendNotification(merchant)}
              className="px-3.5 py-2 text-xs font-medium text-[#7B9D8A] bg-[#DDE9E0] border border-[#D8C29B] rounded-xl hover:bg-[#DDE9E0] transition-all flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" /> Notify
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#6B7280] hover:text-[#2F3A35] hover:bg-[#EAE8E4] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="bg-[#FFFFFF] border-b border-[#EAE8E4] px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none py-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('basic_business')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'basic_business'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profile & Business
          </button>

          <button
            onClick={() => setActiveTab('verification_documents')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'verification_documents'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Docs & Verification ({documents.filter((d) => d.status === 'Verified').length}/{documents.length})
          </button>

          <button
            onClick={() => setActiveTab('pg_listings')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pg_listings'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> PG Listings ({pgListings.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" /> Bookings ({recentBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('revenue_payouts')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'revenue_payouts'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Bank & Payouts
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <Star className="w-3.5 h-3.5" /> Reviews ({reviews.length})
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'complaints'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Disputes ({complaints.length})
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notifications'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Notifications ({notifications.length})
          </button>

          <button
            onClick={() => setActiveTab('activity_audit')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'activity_audit'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Activity Logs
          </button>

          <button
            onClick={() => setActiveTab('admin_actions')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'admin_actions'
                ? 'bg-[#7B9D8A] text-white font-semibold shadow-soft-sm'
                : 'text-[#6B7280] hover:bg-[#DDE9E0] hover:text-[#7B9D8A]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Admin Controls
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Profile & Business Information */}
          {activeTab === 'basic_business' && (
            <div className="space-y-6">
              {/* Top Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-center">
                  <span className="text-[11px] text-[#6B7280] block">Total Revenue</span>
                  <span className="text-lg font-bold text-[#5DA271] font-number mt-0.5 block">
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-center">
                  <span className="text-[11px] text-[#6B7280] block">Monthly Revenue</span>
                  <span className="text-lg font-bold text-[#2F3A35] font-number mt-0.5 block">
                    ₹{metrics.monthlyRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-center">
                  <span className="text-[11px] text-[#6B7280] block">Occupancy Rate</span>
                  <span className="text-lg font-bold text-[#2F3A35] font-number mt-0.5 block">
                    {metrics.occupancyRate}%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-center">
                  <span className="text-[11px] text-[#6B7280] block">Average Rating</span>
                  <span className="text-lg font-bold text-[#2F3A35] font-number mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-[#F4B740] text-[#F4B740]" />
                    {metrics.averageRating > 0 ? metrics.averageRating : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="p-5 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm space-y-4">
                <h3 className="font-semibold text-sm text-[#2F3A35] flex items-center gap-2 border-b border-[#F3F1EC] pb-2.5">
                  <User className="w-4 h-4 text-[#7B9D8A]" />
                  Basic Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#6B7280] block">Full Legal Name</span>
                    <strong className="text-[#2F3A35] font-medium">{basicInfo.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Mobile Number</span>
                    <strong className="text-[#2F3A35] font-medium font-number">{basicInfo.mobileNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Email Address</span>
                    <strong className="text-[#2F3A35] font-medium">{basicInfo.email}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Date of Birth</span>
                    <strong className="text-[#2F3A35] font-medium font-number">{basicInfo.dateOfBirth}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Gender</span>
                    <strong className="text-[#2F3A35] font-medium">{basicInfo.gender}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Registration Date</span>
                    <strong className="text-[#2F3A35] font-medium font-number">{basicInfo.registrationDate}</strong>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-[#6B7280] block">Permanent Residence Address</span>
                    <strong className="text-[#2F3A35] font-medium">{basicInfo.address}, {basicInfo.city}, {basicInfo.state} - {basicInfo.pincode}</strong>
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="p-5 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm space-y-4">
                <h3 className="font-semibold text-sm text-[#2F3A35] flex items-center gap-2 border-b border-[#F3F1EC] pb-2.5">
                  <Building2 className="w-4 h-4 text-[#7B9D8A]" />
                  Business & Enterprise Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#6B7280] block">Business Name</span>
                    <strong className="text-[#2F3A35] font-medium">{businessInfo.businessName}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Business Type</span>
                    <strong className="text-[#2F3A35] font-medium">{businessInfo.businessType}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Years in Business</span>
                    <strong className="text-[#2F3A35] font-medium font-number">{businessInfo.yearsInBusiness} Years</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">GST Registration Number</span>
                    <strong className="text-[#7B9D8A] font-mono font-bold">{businessInfo.gstNumber || 'Not Provided'}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">PAN Number</span>
                    <strong className="text-[#7B9D8A] font-mono font-bold">{businessInfo.panNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Total Operating PGs</span>
                    <strong className="text-[#2F3A35] font-medium font-number">{businessInfo.totalPGs} Properties</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Total Rooms Capacity</span>
                    <strong className="text-[#2F3A35] font-medium font-number">{businessInfo.totalRooms} Rooms ({businessInfo.occupiedRooms} Occupied / {businessInfo.vacantRooms} Vacant)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Verification Status & Uploaded Documents */}
          {activeTab === 'verification_documents' && (
            <div className="space-y-6">
              {/* Verification Checklist Bar */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${verificationStatus.phoneVerified ? 'text-[#5DA271]' : 'text-[#9CA3AF]'}`} />
                  <span>Phone OTP Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${verificationStatus.emailVerified ? 'text-[#5DA271]' : 'text-[#9CA3AF]'}`} />
                  <span>Email Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${verificationStatus.panVerified ? 'text-[#5DA271]' : 'text-[#9CA3AF]'}`} />
                  <span>PAN Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${verificationStatus.bankVerified ? 'text-[#5DA271]' : 'text-[#9CA3AF]'}`} />
                  <span>Bank Account Verified</span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-[#2F3A35] flex items-center justify-between">
                  <span>Uploaded Verification Documents ({documents.length})</span>
                  <span className="text-xs text-[#6B7280] font-normal">Click document to open inspector & approve/reject</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm flex items-start justify-between gap-3 hover:border-[#7B9D8A] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#DDE9E0] text-[#7B9D8A] flex items-center justify-center font-bold flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-[#2F3A35]">{doc.type}</h4>
                          <p className="text-[11px] text-[#6B7280] font-mono mt-0.5 truncate max-w-[180px]">{doc.fileName}</p>
                          {doc.documentNumber && (
                            <p className="text-[11px] text-[#7B9D8A] font-mono font-medium mt-1">
                              ID: {doc.documentNumber}
                            </p>
                          )}
                          <p className="text-[10px] text-[#9CA3AF] mt-1 font-number">Uploaded {doc.uploadedAt}</p>

                          {doc.rejectionReason && (
                            <p className="text-[11px] text-[#C62828] bg-[#FDECEC] p-2 rounded-lg mt-2 border border-[#E56363]/20">
                              Reason: {doc.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            doc.status === 'Verified'
                              ? 'bg-[#E8F5EC] text-[#2E7D32]'
                              : doc.status === 'Changes Requested'
                              ? 'bg-[#DDE9E0] text-[#7B9D8A]'
                              : 'bg-[#FFF8E7] text-[#CC8B00]'
                          }`}
                        >
                          {doc.status}
                        </span>

                        <button
                          onClick={() => onOpenDocumentViewer(doc)}
                          className="px-3 py-1 bg-[#DDE9E0] text-[#7B9D8A] hover:bg-[#DDE9E0] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PG Listings & Portfolio */}
          {activeTab === 'pg_listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#2F3A35]">Merchant PG Listings ({pgListings.length})</h3>
              </div>

              {pgListings.length === 0 ? (
                <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-[#EAE8E4] text-[#6B7280] text-xs">
                  No PG properties listed by this merchant yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pgListings.map((pg) => (
                    <div key={pg.id} className="p-4 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm space-y-3">
                      <div className="relative h-36 rounded-xl overflow-hidden bg-[#F3F1EC]">
                        <img src={pg.coverImage} alt={pg.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-[#2F3A35]">
                          {pg.category}
                        </span>
                        <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          pg.status === 'Live' ? 'bg-[#E8F5EC] text-[#2E7D32]' : 'bg-[#FFF8E7] text-[#CC8B00]'
                        }`}>
                          {pg.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-[#2F3A35]">{pg.name}</h4>
                        <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#7B9D8A]" /> {pg.address}, {pg.city}
                        </p>
                        <p className="text-xs font-semibold text-[#5DA271] font-number mt-1">{pg.rentRange}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F3F1EC] text-xs text-[#6B7280]">
                        <span>Capacity: {pg.occupiedRooms}/{pg.totalRooms} Rooms</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#F4B740] text-[#F4B740]" />
                          {pg.rating} ({pg.reviewCount} reviews)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {pg.amenities.map((a) => (
                          <span key={a} className="px-2 py-0.5 rounded-md bg-[#FFFFFF] border border-[#EAE8E4] text-[10px] text-[#6B7280]">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Bookings & Occupancy */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-[#2F3A35]">Recent Tenant Bookings</h3>

              {recentBookings.length === 0 ? (
                <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-[#EAE8E4] text-[#6B7280] text-xs">
                  No tenant booking records for this merchant yet.
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#EAE8E4] rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFFFFF] border-b border-[#EAE8E4] text-[#6B7280] font-medium">
                      <tr>
                        <th className="py-3 px-3">Booking ID</th>
                        <th className="py-3 px-3">Property</th>
                        <th className="py-3 px-3">Tenant Name</th>
                        <th className="py-3 px-3">Room & Type</th>
                        <th className="py-3 px-3">Check-In</th>
                        <th className="py-3 px-3">Monthly Rent</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F1EC]">
                      {recentBookings.map((b) => (
                        <tr key={b.id}>
                          <td className="py-3 px-3 font-mono font-medium text-[#7B9D8A]">{b.id}</td>
                          <td className="py-3 px-3 font-medium text-[#2F3A35]">{b.pgName}</td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-[#2F3A35]">{b.tenantName}</div>
                            <div className="text-[10px] text-[#6B7280]">{b.tenantPhone}</div>
                          </td>
                          <td className="py-3 px-3">Room {b.roomNumber} ({b.roomType})</td>
                          <td className="py-3 px-3 font-number">{b.checkInDate}</td>
                          <td className="py-3 px-3 font-semibold text-[#5DA271] font-number">₹{b.monthlyRent.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F5EC] text-[#2E7D32]">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Bank Details & Revenue Settlement */}
          {activeTab === 'revenue_payouts' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm space-y-4">
                <h3 className="font-semibold text-sm text-[#2F3A35] flex items-center gap-2 border-b border-[#F3F1EC] pb-2.5">
                  <CreditCard className="w-4 h-4 text-[#7B9D8A]" />
                  Bank Account & Settlement Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div><span className="text-[#6B7280] block">Bank Name</span><strong className="text-[#2F3A35] font-medium">{bankDetails.bankName}</strong></div>
                  <div><span className="text-[#6B7280] block">Account Holder</span><strong className="text-[#2F3A35] font-medium">{bankDetails.accountHolder}</strong></div>
                  <div><span className="text-[#6B7280] block">Account Number</span><strong className="text-[#2F3A35] font-mono font-bold">{bankDetails.accountNumber}</strong></div>
                  <div><span className="text-[#6B7280] block">IFSC Code</span><strong className="text-[#7B9D8A] font-mono font-bold">{bankDetails.ifscCode}</strong></div>
                  <div><span className="text-[#6B7280] block">UPI VPA</span><strong className="text-[#2F3A35] font-medium">{bankDetails.upiId}</strong></div>
                  <div><span className="text-[#6B7280] block">Platform Commission</span><strong className="text-[#2F3A35] font-number font-bold">{bankDetails.commissionPercentage}%</strong></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm space-y-3">
                <h3 className="font-semibold text-sm text-[#2F3A35]">Recent Settlement History</h3>
                {settlements.length === 0 ? (
                  <p className="text-xs text-[#6B7280]">No payouts settled yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FFFFFF] border-b border-[#EAE8E4] text-[#6B7280]">
                        <tr>
                          <th className="py-2.5 px-3">Settlement ID</th>
                          <th className="py-2.5 px-3">Payout Date</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Bank Reference (UTR)</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F1EC]">
                        {settlements.map((s) => (
                          <tr key={s.id}>
                            <td className="py-2.5 px-3 font-mono text-[#7B9D8A]">{s.id}</td>
                            <td className="py-2.5 px-3 font-number">{s.payoutDate}</td>
                            <td className="py-2.5 px-3 font-bold text-[#5DA271] font-number">₹{s.amount.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 font-mono text-[#6B7280]">{s.utrNumber}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F5EC] text-[#2E7D32]">
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-[#2F3A35]">Tenant Reviews & Ratings</h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-[#6B7280] p-4 bg-[#FFFFFF] rounded-xl border border-[#EAE8E4]">No tenant reviews published yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-white border border-[#EAE8E4] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2F3A35]">{r.userName}</span>
                          <span className="text-[#6B7280]">on {r.pgName}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-[#F4B740]">
                          <Star className="w-3.5 h-3.5 fill-[#F4B740]" /> {r.rating}
                        </div>
                      </div>
                      <p className="text-[#2F3A35]">{r.comment}</p>
                      {r.merchantReply && (
                        <div className="p-3 bg-[#DDE9E0] border border-[#D8C29B] rounded-xl text-[11px] text-[#7B9D8A]">
                          <strong>Merchant Reply:</strong> {r.merchantReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Complaints & Disputes */}
          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-[#2F3A35]">Reported Complaints & Disputes</h3>
              {complaints.length === 0 ? (
                <div className="p-6 bg-[#E8F5EC] text-[#2E7D32] rounded-2xl border border-[#5DA271]/30 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#5DA271]" />
                  No open complaints or dispute tickets against this merchant.
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white border border-[#EAE8E4] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-[#C62828]">{c.id}</span>
                          <span className="font-semibold text-[#2F3A35]">{c.complaintType}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FDECEC] text-[#C62828] font-bold">
                            {c.priority} Priority
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF8E7] text-[#CC8B00]">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[#2F3A35]">{c.description}</p>
                      <div className="text-[11px] text-[#6B7280]">Reported by: {c.reportedBy} ({c.tenantPhone})</div>

                      {c.resolutionNotes && (
                        <div className="p-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[11px]">
                          <strong>Resolution Notes:</strong> {c.resolutionNotes}
                        </div>
                      )}

                      {c.status !== 'Resolved' && (
                        <button
                          onClick={() => setSelectedComplaintId(c.id)}
                          className="px-3 py-1 bg-[#7B9D8A] text-white rounded-lg text-[11px] font-semibold hover:bg-[#6D8F7D]"
                        >
                          Resolve Dispute
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Resolve Form Modal Trigger */}
              {selectedComplaintId && (
                <form onSubmit={handleResolveComplaintSubmit} className="p-4 bg-[#FFF8E7] border border-[#F4B740]/40 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-bold text-[#CC8B00]">Resolve Complaint {selectedComplaintId}</h4>
                  <textarea
                    rows={2}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Enter resolution details (e.g. Deposit refunded to tenant, warning issued)..."
                    className="w-full p-2.5 bg-white border border-[#EAE8E4] rounded-xl text-xs"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setSelectedComplaintId(null)} className="px-3 py-1 text-[#6B7280]">Cancel</button>
                    <button type="submit" className="px-4 py-1 bg-[#5DA271] text-white rounded-xl font-bold">Mark Resolved</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 8: Notifications Log */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#2F3A35]">Sent Push Notifications History</h3>
                <button
                  onClick={() => onOpenSendNotification(merchant)}
                  className="px-3.5 py-1.5 bg-[#7B9D8A] text-white rounded-xl text-xs font-semibold hover:bg-[#6D8F7D] flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Send New Notification
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-[#6B7280]">No notifications sent to merchant yet.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-white border border-[#EAE8E4] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#2F3A35]">{n.title}</span>
                        <span className="text-[10px] text-[#6B7280] font-number">{n.sentAt}</span>
                      </div>
                      <p className="text-[#6B7280]">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: Activity & Audit Logs */}
          {activeTab === 'activity_audit' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-[#2F3A35]">Merchant Activity Timeline & Audit Logs</h3>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#EAE8E4]">
                {activityLogs.map((log) => (
                  <div key={log.id} className="relative pl-8 text-xs">
                    <div className="absolute left-2 top-1 w-3 h-3 rounded-full bg-[#7B9D8A] ring-4 ring-white" />
                    <div className="p-3 bg-white rounded-xl border border-[#EAE8E4] shadow-soft-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2F3A35]">{log.action}</span>
                        <span className="text-[10px] text-[#6B7280] font-number">{log.timestamp}</span>
                      </div>
                      <p className="text-[#6B7280] mt-0.5">{log.details}</p>
                      <span className="text-[10px] text-[#6B7280] block mt-1">Performed By: {log.performedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: Admin Controls & Permissions */}
          {activeTab === 'admin_actions' && (
            <div className="space-y-6">
              {/* Account Status Transition Control Box */}
              <div className="p-5 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm space-y-4">
                <h3 className="font-semibold text-sm text-[#2F3A35] flex items-center gap-2 border-b border-[#F3F1EC] pb-2.5">
                  <Lock className="w-4 h-4 text-[#7B9D8A]" />
                  Admin Account Status Actions
                </h3>

                <div>
                  <label className="text-xs text-[#6B7280] block mb-1.5 font-medium">Reason / Internal Note for Action</label>
                  <input
                    type="text"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Enter reason for status change (e.g. Document verified, complaint pending)..."
                    className="w-full p-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-xs text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-[#5DA271] text-white rounded-xl text-xs font-semibold hover:bg-[#2E7D32] flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Merchant
                  </button>

                  <button
                    onClick={handleRequestChanges}
                    className="px-4 py-2 bg-[#DDE9E0] text-[#7B9D8A] border border-[#D8C29B] rounded-xl text-xs font-semibold hover:bg-[#DDE9E0] flex items-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4" /> Request Document Changes
                  </button>

                  <button
                    onClick={handleSuspend}
                    className="px-4 py-2 bg-[#FDECEC] text-[#C62828] border border-[#E56363]/20 rounded-xl text-xs font-semibold hover:bg-[#E56363] hover:text-white flex items-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4" /> Suspend Account
                  </button>

                  <button
                    onClick={handleBlock}
                    className="px-4 py-2 bg-[#343230] text-white rounded-xl text-xs font-semibold hover:bg-[#2F3A35] flex items-center gap-1"
                  >
                    <Ban className="w-4 h-4" /> Permanently Block
                  </button>
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="p-5 rounded-2xl bg-white border border-[#EAE8E4] shadow-soft-sm space-y-4">
                <h3 className="font-semibold text-sm text-[#2F3A35] border-b border-[#F3F1EC] pb-2.5">
                  Merchant Permissions Control Matrix
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(permissions).map(([key, enabled]) => (
                    <div key={key} className="p-3 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4] flex items-center justify-between">
                      <span className="font-medium text-[#2F3A35]">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^can /, 'Can ')}
                      </span>

                      <button
                        onClick={() => onTogglePermission(merchant.id, key as any)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          enabled ? 'bg-[#5DA271]' : 'bg-[#EAE8E4]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                            enabled ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
