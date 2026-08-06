import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Upload, Building2, CreditCard, ArrowRight, ArrowLeft, Play, Sparkles } from 'lucide-react';
import { Merchant } from '../../types/merchant';

interface MerchantRegistrationSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onMerchantCreated: (newMerchant: Merchant) => void;
}

export const MerchantRegistrationSimulator: React.FC<MerchantRegistrationSimulatorProps> = ({
  isOpen,
  onClose,
  onMerchantCreated,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('Rahul Deshmukh');
  const [email, setEmail] = useState('rahul.deshmukh@zenithstays.com');
  const [phone, setPhone] = useState('+91 98234 56789');
  const [otp, setOtp] = useState('482910');
  const [businessName, setBusinessName] = useState('Zenith Stays & PG Services');
  const [businessType, setBusinessType] = useState<'Sole Proprietorship' | 'Private Limited' | 'Partnership'>('Partnership');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('14, Indiranagar 100ft Road');
  const [gstNumber, setGstNumber] = useState('29AABFR9981K1Z2');
  const [panNumber, setPanNumber] = useState('AABFR9981K');
  
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountHolder, setAccountHolder] = useState('Zenith Stays Partnership');
  const [accountNumber, setAccountNumber] = useState('50200088910293');
  const [ifscCode, setIfscCode] = useState('HDFC0001029');
  const [upiId, setUpiId] = useState('zenithstays@hdfcbank');

  const [docAadhaarUploaded, setDocAadhaarUploaded] = useState(true);
  const [docPanUploaded, setDocPanUploaded] = useState(true);
  const [docChequeUploaded, setDocChequeUploaded] = useState(true);

  const handleCompleteSubmission = () => {
    const createdId = `MER-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newMerchant: Merchant = {
      id: createdId,
      basicInfo: {
        merchantId: createdId,
        fullName: fullName || 'Rahul Deshmukh',
        profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
        mobileNumber: phone || '+91 98234 56789',
        email: email || 'rahul.deshmukh@zenithstays.com',
        dateOfBirth: '1989-04-12',
        gender: 'Male',
        address: address || 'Indiranagar 100ft Road',
        city: city || 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        registrationDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Just now',
        accountStatus: 'Pending Verification',
      },
      businessInfo: {
        businessName: businessName || 'Zenith Stays & PG Services',
        businessType: businessType,
        gstNumber: gstNumber || '29AABFR9981K1Z2',
        panNumber: panNumber || 'AABFR9981K',
        businessAddress: `${address}, ${city}`,
        city: city,
        yearsInBusiness: 2,
        totalPGs: 1,
        totalRooms: 20,
        occupiedRooms: 0,
        vacantRooms: 20,
      },
      verificationStatus: {
        emailVerified: true,
        phoneVerified: true,
        panVerified: true,
        aadhaarVerified: docAadhaarUploaded,
        bankVerified: true,
        gstVerified: true,
        agreementUploaded: true,
        policeVerification: false,
      },
      documents: [
        {
          id: `DOC-A-${Date.now()}`,
          type: 'Aadhaar',
          fileName: 'Rahul_Aadhaar_Card.pdf',
          fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          uploadedAt: 'Just now',
          status: 'Pending',
          documentNumber: 'XXXX-XXXX-8821',
        },
        {
          id: `DOC-P-${Date.now()}`,
          type: 'PAN',
          fileName: 'Rahul_PAN_Scan.png',
          fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
          uploadedAt: 'Just now',
          status: 'Verified',
          documentNumber: panNumber,
        },
        {
          id: `DOC-C-${Date.now()}`,
          type: 'Cancelled Cheque',
          fileName: 'HDFC_Cancelled_Cheque.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
          uploadedAt: 'Just now',
          status: 'Pending',
        },
      ],
      bankDetails: {
        bankName: bankName,
        accountHolder: accountHolder,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        upiId: upiId,
        payoutStatus: 'Pending Payout',
        pendingPayoutAmount: 0,
        lifetimeEarnings: 0,
        lastPayoutDate: 'N/A',
        commissionPercentage: 10,
      },
      pgListings: [
        {
          id: `PG-SIM-${Date.now()}`,
          name: `${businessName} - Indiranagar`,
          category: 'Unisex / Co-living',
          address: address,
          city: city,
          area: 'Indiranagar',
          status: 'Pending Review',
          totalRooms: 20,
          occupiedRooms: 0,
          availableRooms: 20,
          rentRange: '₹12,000 - ₹20,000 / month',
          rating: 0,
          reviewCount: 0,
          coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
          amenities: ['Food Included', 'High Speed WiFi', 'Washing Machine', 'Housekeeping'],
          createdDate: new Date().toISOString().split('T')[0],
          rooms: [],
        },
      ],
      recentBookings: [],
      settlements: [],
      reviews: [],
      complaints: [],
      notifications: [
        {
          id: `NOTIF-S-${Date.now()}`,
          title: 'Welcome to StayNest!',
          message: 'Your registration application has been submitted and is currently being audited by admin.',
          type: 'Approval',
          sentAt: 'Just now',
          read: false,
        },
      ],
      activityLogs: [
        {
          id: `LOG-S-${Date.now()}`,
          action: 'Self Registration Completed',
          performedBy: 'Merchant Simulator',
          timestamp: 'Just now',
          details: 'Uploaded Aadhaar, PAN, Bank Details & PG Listing.',
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
        canAcceptBookings: false,
        canCancelBookings: false,
        canReceivePayments: false,
        canWithdrawEarnings: false,
        canRespondReviews: true,
        canManageAvailability: true,
      },
    };

    onMerchantCreated(newMerchant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F3A35]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-soft-lg border border-[#EAE8E4] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#EAE8E4] bg-[#FAF8F4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7B9D8A] text-white flex items-center justify-center font-bold">
              <Play className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#2F3A35] text-lg">Merchant Onboarding Simulator</h3>
                <span className="text-[10px] bg-[#D8C29B] text-[#2F3A35] px-2 py-0.5 rounded-full font-bold">
                  Interactive Step {step}/5
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">Simulate the end-to-end registration flow of a new PG owner</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-[#6B7280] hover:text-[#2F3A35] hover:bg-[#EAE8E4] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#FFFFFF] px-6 py-3 border-b border-[#EAE8E4] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#7B9D8A] text-white' : 'bg-[#EAE8E4] text-[#6B7280]'}`}>1</div>
            <span className={step === 1 ? 'font-bold text-[#2F3A35]' : 'text-[#6B7280]'}>Account</span>
          </div>
          <div className="h-0.5 w-8 bg-[#EAE8E4]" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#7B9D8A] text-white' : 'bg-[#EAE8E4] text-[#6B7280]'}`}>2</div>
            <span className={step === 2 ? 'font-bold text-[#2F3A35]' : 'text-[#6B7280]'}>Business</span>
          </div>
          <div className="h-0.5 w-8 bg-[#EAE8E4]" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#7B9D8A] text-white' : 'bg-[#EAE8E4] text-[#6B7280]'}`}>3</div>
            <span className={step === 3 ? 'font-bold text-[#2F3A35]' : 'text-[#6B7280]'}>Docs</span>
          </div>
          <div className="h-0.5 w-8 bg-[#EAE8E4]" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 4 ? 'bg-[#7B9D8A] text-white' : 'bg-[#EAE8E4] text-[#6B7280]'}`}>4</div>
            <span className={step === 4 ? 'font-bold text-[#2F3A35]' : 'text-[#6B7280]'}>Bank</span>
          </div>
          <div className="h-0.5 w-8 bg-[#EAE8E4]" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 5 ? 'bg-[#5DA271] text-white' : 'bg-[#EAE8E4] text-[#6B7280]'}`}>5</div>
            <span className={step === 5 ? 'font-bold text-[#2E7D32]' : 'text-[#6B7280]'}>Review</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-[#2F3A35] text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7B9D8A]" />
                Step 1: Merchant Account & OTP Verification
              </h4>
              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#E8F5EC] border border-[#5DA271]/30 rounded-2xl flex items-center justify-between text-xs text-[#2E7D32]">
                <span>OTP Auto-verified via SMS gateway</span>
                <span className="font-mono font-bold">Code: {otp} (Verified ✓)</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-[#2F3A35] text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#7B9D8A]" />
                Step 2: Business & PG Portfolio Information
              </h4>

              <div>
                <label className="text-xs text-[#6B7280] block mb-1">Business / Enterprise Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Business Entity Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                  >
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Private Limited">Private Limited</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Operating City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">GST Number</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-[#2F3A35] text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#7B9D8A]" />
                Step 3: Verification Documents Upload
              </h4>

              <div className="space-y-3">
                <div className="p-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#2F3A35] block">Aadhaar Card (Front/Back)</span>
                    <span className="text-[11px] text-[#6B7280]">Rahul_Aadhaar_Card.pdf</span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] bg-[#E8F5EC] text-[#2E7D32] rounded-full font-semibold">
                    Uploaded ✓
                  </span>
                </div>

                <div className="p-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#2F3A35] block">PAN Card Copy</span>
                    <span className="text-[11px] text-[#6B7280]">Rahul_PAN_Scan.png</span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] bg-[#E8F5EC] text-[#2E7D32] rounded-full font-semibold">
                    Uploaded ✓
                  </span>
                </div>

                <div className="p-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#2F3A35] block">Cancelled Cheque / Passbook</span>
                    <span className="text-[11px] text-[#6B7280]">HDFC_Cancelled_Cheque.jpg</span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] bg-[#E8F5EC] text-[#2E7D32] rounded-full font-semibold">
                    Uploaded ✓
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-[#2F3A35] text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#7B9D8A]" />
                Step 4: Bank Details for Payout Settlements
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl font-mono text-[#2F3A35]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl font-mono uppercase text-[#2F3A35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6B7280] block mb-1">UPI VPA ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-xl text-[#2F3A35]"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 bg-[#E8F5EC] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-lg text-[#2F3A35]">Ready to Submit Registration</h4>
              <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                Submitting will add <strong className="text-[#2F3A35]">{fullName} ({businessName})</strong> directly into the Admin Module under <span className="text-[#CC8B00] font-semibold">Pending Verification</span> state for live audit.
              </p>

              <div className="p-4 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between"><span className="text-[#6B7280]">Merchant:</span> <strong className="text-[#2F3A35]">{fullName}</strong></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">City:</span> <strong className="text-[#2F3A35]">{city}</strong></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Docs Uploaded:</span> <strong className="text-[#2E7D32]">Aadhaar, PAN, Cheque</strong></div>
                <div className="flex justify-between"><span className="text-[#6B7280]">Bank Account:</span> <strong className="text-[#2F3A35]">{bankName} - {accountNumber.slice(-4)}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-[#EAE8E4] bg-[#FFFFFF] flex items-center justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-xs font-medium text-[#6B7280] disabled:opacity-30 hover:bg-[#EAE8E4] rounded-xl flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 text-xs font-semibold bg-[#7B9D8A] text-white rounded-xl hover:bg-[#6D8F7D] shadow-soft-sm flex items-center gap-1"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleCompleteSubmission}
              className="px-6 py-2.5 text-xs font-semibold bg-[#5DA271] text-white rounded-xl hover:bg-[#2E7D32] shadow-soft-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit for Admin Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
