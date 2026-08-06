import React, { useRef, useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Lock, 
  Bell, 
  Camera, 
  Save, 
  CheckCircle2, 
  ShieldCheck,
  QrCode,
  Upload,
  LogOut,
} from 'lucide-react';

interface ProfileViewProps {
  profile: {
    profilePhoto: string;
    name: string;
    mobileNumber: string;
    email: string;
    businessName: string;
    businessType: string;
    gstNumber: string;
    panNumber: string;
    businessAddress: string;
    paymentQrUrl?: string;
    upiId?: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      whatsapp: boolean;
    };
  };
  onSaveProfile: (updatedProfile: any) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onLogout,
}) => {
  const qrFileRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto);
  const [name, setName] = useState(profile.name);
  const [mobileNumber, setMobileNumber] = useState(profile.mobileNumber);
  const [email, setEmail] = useState(profile.email);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [businessType, setBusinessType] = useState(profile.businessType);
  const [gstNumber, setGstNumber] = useState(profile.gstNumber);
  const [panNumber, setPanNumber] = useState(profile.panNumber);
  const [businessAddress, setBusinessAddress] = useState(profile.businessAddress);
  const [paymentQrUrl, setPaymentQrUrl] = useState(profile.paymentQrUrl || '');
  const [upiId, setUpiId] = useState(profile.upiId || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles
  const [notifications, setNotifications] = useState(profile.notifications);

  const [toastSuccess, setToastSuccess] = useState<string | null>(null);

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleQrFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setPaymentQrUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onSaveProfile({
      profilePhoto,
      name,
      mobileNumber,
      email,
      businessName,
      businessType,
      gstNumber,
      panNumber,
      businessAddress,
      paymentQrUrl,
      upiId,
      notifications
    });

    setToastSuccess('Profile saved!');
    setTimeout(() => setToastSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3A35]">PG Owner Profile & Settings</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage your merchant personal details, business info, password, and notification alerts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7B9D8A] text-white font-semibold text-xs hover:bg-[#6D8F7D] shadow-soft-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {toastSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5EC] border border-[#5DA271]/30 text-[#5DA271] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastSuccess}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-6 sm:p-8 shadow-soft-sm space-y-8">
        {/* Photo & Name Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#F3F1EC]">
          <div className="relative group">
            <img
              src={profilePhoto}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-2 border-[#D8C29B] shadow-soft-sm"
            />
            <button
              onClick={() => {
                const newPhoto = prompt("Enter Image URL for Profile Photo:", profilePhoto);
                if (newPhoto) setProfilePhoto(newPhoto);
              }}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#7B9D8A] text-white shadow-soft-sm hover:bg-[#6D8F7D]"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-[#2F3A35]">{name}</h2>
            <p className="text-xs font-semibold text-[#7B9D8A] flex items-center justify-center sm:justify-start gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{businessName}</span>
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5DA271] bg-[#E8F5EC] border border-[#5DA271]/30 px-2.5 py-0.5 rounded-full mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Merchant
            </span>
          </div>
        </div>

        {/* Payment QR — display only; we do not mediate money */}
        <div className="space-y-3 p-4 rounded-[20px] bg-[#FAF8F4] border border-[#D8C29B]">
          <h3 className="font-bold text-base text-[#2F3A35] flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#7B9D8A]" />
            <span>Your payment QR</span>
          </h3>
          <p className="text-xs text-[#6B7280]">
            Upload your PhonePe / GPay / Paytm QR. Residents scan this when they pay rent. SMS reminders use each resident’s payment date.
          </p>
          <input ref={qrFileRef} type="file" accept="image/*" className="hidden" onChange={handleQrFile} />
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {paymentQrUrl ? (
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#D8C29B] bg-white shrink-0">
                <img src={paymentQrUrl} alt="QR" className="w-full h-full object-contain p-2" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => qrFileRef.current?.click()}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#D8C29B] bg-white flex flex-col items-center justify-center gap-2 text-[#7B9D8A] shrink-0"
              >
                <Upload className="w-6 h-6" />
                <span className="text-[11px] font-bold">Upload QR</span>
              </button>
            )}
            <div className="space-y-2 flex-1 w-full">
              <button
                type="button"
                onClick={() => qrFileRef.current?.click()}
                className="px-4 py-2 rounded-2xl bg-[#7B9D8A] text-white text-xs font-bold"
              >
                {paymentQrUrl ? 'Change QR' : 'Choose QR photo'}
              </button>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="UPI ID optional — e.g. name@ybl"
                className="w-full px-4 py-2.5 text-xs bg-white border border-[#EAE8E4] rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Section 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-[#2F3A35] flex items-center gap-2">
            <User className="w-4 h-4 text-[#7B9D8A]" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Phone Number</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Details */}
        <div className="space-y-4 pt-4 border-t border-[#F3F1EC]">
          <h3 className="font-bold text-base text-[#2F3A35] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#7B9D8A]" />
            <span>Business Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">PAN Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Registered Business Address</label>
              <textarea
                rows={2}
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Password & Security */}
        <div className="space-y-4 pt-4 border-t border-[#F3F1EC]">
          <h3 className="font-bold text-base text-[#2F3A35] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#7B9D8A]" />
            <span>Password & Security</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Notification Settings */}
        <div className="space-y-4 pt-4 border-t border-[#F3F1EC]">
          <h3 className="font-bold text-base text-[#2F3A35] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#7B9D8A]" />
            <span>Notification Settings</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'email', label: 'Email Alerts' },
              { key: 'sms', label: 'SMS Notifications' },
              { key: 'push', label: 'Push Alerts' },
              { key: 'whatsapp', label: 'WhatsApp Updates' },
            ].map((item) => {
              const k = item.key as keyof typeof notifications;
              const isChecked = notifications[k];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleToggleNotification(k)}
                  className={`p-3 rounded-2xl text-xs font-bold border text-left flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-[#7B9D8A] text-white border-[#7B9D8A]'
                      : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4]'
                  }`}
                >
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Footer */}
        <div className="pt-6 border-t border-[#F3F1EC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-[#F5C4C4] bg-[#FFF8F8] text-[#E56363] font-bold text-xs hover:bg-[#FDECEC] transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#7B9D8A] text-white font-bold text-xs hover:bg-[#6D8F7D] shadow-soft-md sm:ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
