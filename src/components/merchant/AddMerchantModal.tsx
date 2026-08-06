import React, { useState } from 'react';
import { X, PlusCircle, Building2, User, Phone, Mail, MapPin } from 'lucide-react';
import { Merchant } from '../../types/merchant';

interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerchant: (merchant: Merchant) => void;
}

export const AddMerchantModal: React.FC<AddMerchantModalProps> = ({
  isOpen,
  onClose,
  onAddMerchant,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<'Sole Proprietorship' | 'Partnership' | 'Private Limited' | 'Individual'>('Sole Proprietorship');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !businessName.trim()) return;

    const newId = `MER-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newMerchant: Merchant = {
      id: newId,
      basicInfo: {
        merchantId: newId,
        fullName,
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        mobileNumber: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        email,
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        address: address || 'Main City Area',
        city,
        state: 'Karnataka',
        pincode: '560001',
        registrationDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Just now',
        accountStatus: 'Pending Verification',
      },
      businessInfo: {
        businessName,
        businessType,
        gstNumber: gstNumber.toUpperCase(),
        panNumber: panNumber.toUpperCase(),
        businessAddress: `${address}, ${city}`,
        city,
        yearsInBusiness: 1,
        totalPGs: 0,
        totalRooms: 0,
        occupiedRooms: 0,
        vacantRooms: 0,
      },
      verificationStatus: {
        emailVerified: true,
        phoneVerified: true,
        panVerified: !!panNumber,
        aadhaarVerified: false,
        bankVerified: false,
        gstVerified: !!gstNumber,
        agreementUploaded: false,
        policeVerification: false,
      },
      documents: [],
      bankDetails: {
        bankName: 'Pending Bank Setup',
        accountHolder: fullName,
        accountNumber: 'N/A',
        ifscCode: 'N/A',
        upiId: '',
        payoutStatus: 'Pending Payout',
        pendingPayoutAmount: 0,
        lifetimeEarnings: 0,
        lastPayoutDate: 'N/A',
        commissionPercentage: 10,
      },
      pgListings: [],
      recentBookings: [],
      settlements: [],
      reviews: [],
      complaints: [],
      notifications: [
        {
          id: `NOTIF-A-${Date.now()}`,
          title: 'Direct Admin Registration',
          message: 'Your merchant profile was created directly by system administrator.',
          type: 'System',
          sentAt: 'Just now',
          read: false,
        },
      ],
      activityLogs: [
        {
          id: `LOG-A-${Date.now()}`,
          action: 'Merchant Created',
          performedBy: 'Admin Direct',
          timestamp: 'Just now',
          details: 'Account manually provisioned by Admin',
          category: 'Profile',
        },
      ],
      metrics: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        occupancyRate: 0,
        averageRating: 0,
        responseRate: '100%',
        cancellationRate: '0%',
      },
      permissions: {
        canCreatePG: true,
        canEditPG: true,
        canDeletePG: false,
        canAddRooms: true,
        canEditPrices: true,
        canAcceptBookings: true,
        canCancelBookings: true,
        canReceivePayments: true,
        canWithdrawEarnings: true,
        canRespondReviews: true,
        canManageAvailability: true,
      },
    };

    onAddMerchant(newMerchant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F3A35]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[28px] max-w-xl w-full overflow-hidden shadow-soft-lg border border-[#EAE8E4] flex flex-col">
        <div className="p-5 border-b border-[#EAE8E4] bg-[#FFFFFF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7B9D8A] text-white flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2F3A35]">Add New PG Merchant Owner</h3>
              <p className="text-xs text-[#6B7280]">Direct admin provisioning module</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#6B7280] hover:bg-[#EAE8E4] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6B7280] block mb-1 font-medium">Merchant Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anand Mahindra"
                className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1 font-medium">Mobile Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] block mb-1 font-medium">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. owner@pgcompany.com"
              className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6B7280] block mb-1 font-medium">Business / Entity Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Stanza Stays"
                className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                required
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1 font-medium">Business Entity Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
              >
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6B7280] block mb-1 font-medium">Operating City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>
            <div>
              <label className="text-xs text-[#6B7280] block mb-1 font-medium">PAN Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="ABCDE1234F"
                className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl uppercase font-mono text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#6B7280] block mb-1 font-medium">GSTIN (Optional)</label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="29ABCDE1234F1Z5"
              className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl uppercase font-mono text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
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
              className="px-5 py-2 text-xs font-semibold bg-[#7B9D8A] text-white rounded-xl hover:bg-[#6D8F7D] shadow-soft-sm"
            >
              Add Merchant Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
