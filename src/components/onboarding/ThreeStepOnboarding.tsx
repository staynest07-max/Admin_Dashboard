import React, { useRef, useState } from 'react';
import {
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  ChevronDown,
  PlusCircle,
  QrCode,
  Upload,
  Landmark,
} from 'lucide-react';

export interface MerchantOnboardingData {
  profilePhoto: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  panNumber: string;
  paymentQrUrl: string;
  upiId: string;
}

interface ThreeStepOnboardingProps {
  initialData: Partial<MerchantOnboardingData>;
  onCompleteOnboarding: (data: MerchantOnboardingData, action: 'add-pg' | 'skip') => void;
}

export const ThreeStepOnboarding: React.FC<ThreeStepOnboardingProps> = ({
  initialData,
  onCompleteOnboarding,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profilePhoto, setProfilePhoto] = useState(
    initialData.profilePhoto ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  );
  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [mobileNumber] = useState(initialData.mobileNumber || '+91 98765 43210');
  const [email, setEmail] = useState(initialData.email || '');
  const [businessName, setBusinessName] = useState(initialData.businessName || '');
  const [businessType, setBusinessType] = useState(initialData.businessType || 'PG Owner');

  const [businessAddress, setBusinessAddress] = useState(initialData.businessAddress || '');
  const [city, setCity] = useState(initialData.city || 'Hyderabad');
  const [state] = useState(initialData.state || 'Telangana');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState(initialData.pincode || '');
  const [gstNumber, setGstNumber] = useState(initialData.gstNumber || '');
  const [panNumber, setPanNumber] = useState(initialData.panNumber || '');

  const [paymentQrUrl, setPaymentQrUrl] = useState(initialData.paymentQrUrl || '');
  const [upiId, setUpiId] = useState(initialData.upiId || '');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQrFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose a photo of your QR code (image file).');
      return;
    }
    const url = URL.createObjectURL(file);
    setPaymentQrUrl(url);
    setErrorMsg(null);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please write your full name.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMsg('Please write your PG / business name.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  const handleFinish = (action: 'add-pg' | 'skip') => {
    if (!paymentQrUrl) {
      setErrorMsg('Please upload your payment QR photo. Tenants will scan this to pay you.');
      return;
    }
    setErrorMsg(null);
    onCompleteOnboarding(getFullData(), action);
  };

  const getFullData = (): MerchantOnboardingData => ({
    profilePhoto,
    fullName,
    mobileNumber,
    email,
    businessName,
    businessType,
    businessAddress: [area, businessAddress].filter(Boolean).join(', '),
    city,
    state,
    pincode,
    gstNumber,
    panNumber,
    paymentQrUrl,
    upiId,
  });

  const stepLabel =
    currentStep === 1 ? 'About you' : currentStep === 2 ? 'Your PG place' : 'Payment QR';

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-[#EAE8E4] rounded-[32px] max-w-xl w-full p-6 sm:p-10 shadow-soft-lg space-y-8 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B7280]">
            <span>Step {currentStep} of 3</span>
            <span className="text-[#7B9D8A]">{stepLabel}</span>
          </div>
          <div className="h-2 bg-[#F3F1EC] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#7B9D8A] transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-[#FDECEC] border border-[#E56363]/30 text-[#E56363] text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* STEP 1 — About you */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] flex items-center justify-center mx-auto shadow-soft-sm">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#2F3A35]">About you</h2>
              <p className="text-xs text-[#6B7280]">
                Just your name and PG name. Keep it simple.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative group">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#D8C29B] shadow-soft-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Paste photo link (or skip):', profilePhoto);
                    if (url) setProfilePhoto(url);
                  }}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#7B9D8A] text-white shadow-soft-sm hover:bg-[#6D8F7D] transition-all"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-[#6B7280] font-medium">Your photo (optional)</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">
                  Your full name <span className="text-[#E56363]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    placeholder="Example: Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-medium text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">
                  Mobile number <span className="text-[10px] font-normal text-[#5DA271] ml-1">(already verified)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    readOnly
                    value={`${mobileNumber} ✔`}
                    className="w-full pl-10 pr-4 py-3 bg-[#F3F1EC] border border-[#EAE8E4] rounded-2xl font-number text-[#2F3A35] font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">
                  Email <span className="font-normal text-[#6B7280]">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="email"
                    placeholder="Only if you have one"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-medium text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">
                  Your PG / business name <span className="text-[#E56363]">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    placeholder="Example: Sunrise Ladies PG"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-medium text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">What do you run?</label>
                <div className="relative">
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-bold text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A] appearance-none cursor-pointer"
                  >
                    <option value="PG Owner">PG Owner</option>
                    <option value="Co-Living Operator">Co-Living</option>
                    <option value="Hostel Manager">Hostel</option>
                    <option value="Apartment Landlord">Room / Flat owner</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#7B9D8A] text-white font-bold text-sm rounded-2xl hover:bg-[#6D8F7D] transition-all shadow-soft-sm flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2 — Place */}
        {currentStep === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] flex items-center justify-center mx-auto shadow-soft-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#2F3A35]">Where is your PG?</h2>
              <p className="text-xs text-[#6B7280]">City is enough for now. Address can be added later.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">
                  City <span className="text-[#E56363]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Example: Hyderabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-medium text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">
                  Area / locality <span className="font-normal text-[#6B7280]">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Example: Gachibowli"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-medium text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2F3A35] mb-1">
                  Full address <span className="font-normal text-[#6B7280]">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="House / plot number, street, landmark"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full p-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-medium text-[#2F3A35] focus:outline-none focus:border-[#7B9D8A]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#F3F1EC] text-[11px] text-[#6B7280]">
                GST and PAN are <strong>not needed</strong> to start. You can add them later in Profile if you want.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#6B7280] hover:text-[#2F3A35] font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-[#7B9D8A] text-white font-bold text-sm rounded-2xl hover:bg-[#6D8F7D] transition-all shadow-soft-sm flex items-center justify-center gap-2"
              >
                <span>Next — Payment QR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 — Payment QR (main) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] flex items-center justify-center mx-auto shadow-soft-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#2F3A35]">Upload your payment QR</h2>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                Open PhonePe / GPay / Paytm → your QR → screenshot → upload here.
                Residents will use this QR when they pay rent.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleQrFile}
            />

            {paymentQrUrl ? (
              <div className="space-y-3">
                <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#D8C29B] bg-[#FFFFFF] shadow-soft-sm">
                  <img src={paymentQrUrl} alt="Your payment QR" className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex items-center justify-center gap-2 text-[#5DA271] text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>QR uploaded successfully</span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 text-xs font-bold text-[#7B9D8A] hover:underline"
                >
                  Change QR photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 rounded-[24px] border-2 border-dashed border-[#D8C29B] bg-[#FAF8F4] hover:bg-[#DDE9E0] transition-all text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#7B9D8A] text-white flex items-center justify-center mx-auto">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#2F3A35]">Tap to upload QR photo</p>
                  <p className="text-[11px] text-[#6B7280] mt-1">From gallery or camera · JPG / PNG</p>
                </div>
              </button>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2F3A35] mb-1">
                UPI ID <span className="font-normal text-[#6B7280]">(optional — only if you know it)</span>
              </label>
              <input
                type="text"
                placeholder="Example: ramesh@ybl or name@okicici"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl text-xs font-medium focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F3F1EC] border border-[#EAE8E4] flex items-start gap-2.5 text-[11px] text-[#6B7280]">
              <Landmark className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
              <p>
                <strong className="text-[#2F3A35]">Bank is optional.</strong> QR is enough to start.
                Every month we can send an SMS on each resident’s rent day (join day by default — you can change it anytime).
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setCurrentStep(2);
                }}
                className="px-4 py-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#6B7280] hover:text-[#2F3A35] font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => handleFinish('add-pg')}
                className="flex-1 py-3.5 bg-[#7B9D8A] text-white font-bold text-sm rounded-2xl hover:bg-[#6D8F7D] transition-all shadow-soft-md flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Save & Add My PG</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleFinish('skip')}
              className="w-full py-2 text-xs font-bold text-[#6B7280] hover:text-[#2F3A35]"
            >
              Save QR & go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
