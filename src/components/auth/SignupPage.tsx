import React, { useState } from 'react';
import { Building2, Mail, Phone, User, ArrowRight, ShieldCheck } from 'lucide-react';

export interface SignupFormData {
  fullName: string;
  businessName: string;
  phone: string;
  email?: string;
}

interface SignupPageProps {
  onSignupSuccess: (data: SignupFormData) => void;
  onGoToLogin: () => void;
}

const DEMO_OTP = '123456';

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function isValidIndianMobile(phone: string) {
  const digits = digitsOnly(phone);
  if (digits.length === 10) return /^[6-9]/.test(digits);
  if (digits.length === 12 && digits.startsWith('91')) return /^91[6-9]/.test(digits);
  return false;
}

function formatPhoneDisplay(phone: string) {
  const digits = digitsOnly(phone);
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith('91')) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone.trim();
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onGoToLogin }) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSentHint, setOtpSentHint] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !businessName.trim() || !phone.trim()) {
      setError('Please fill name, business name and mobile number.');
      return;
    }
    if (!isValidIndianMobile(phone)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    setStep('otp');
    setOtpSentHint(true);
    setOtp('');
  };

  const handleVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.trim() !== DEMO_OTP) {
      setError(`Invalid OTP. Use demo OTP ${DEMO_OTP}.`);
      return;
    }

    onSignupSuccess({
      fullName: fullName.trim(),
      businessName: businessName.trim(),
      phone: formatPhoneDisplay(phone),
      email: email.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#7B9D8A] text-white flex items-center justify-center mx-auto shadow-soft-md mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#2F3A35] tracking-tight">StayNest</h1>
          <p className="text-sm text-[#6B7280] mt-1">Create Merchant Account</p>
        </div>

        <div className="bg-white border border-[#EAE8E4] rounded-[28px] p-6 sm:p-8 shadow-soft-lg space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#2F3A35]">
              {step === 'details' ? 'Sign up with mobile' : 'Verify OTP'}
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              {step === 'details'
                ? 'Mobile number is your login ID. Email is optional.'
                : `Enter the OTP sent to ${formatPhoneDisplay(phone)}`}
            </p>
          </div>

          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A] text-sm"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">Business / PG Name *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A] text-sm"
                    placeholder="e.g. Sunrise PG & Hospitality"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">Mobile Number *</label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-2xl border border-r-0 border-[#EAE8E4] bg-[#F3F1EC] text-sm font-semibold text-[#2F3A35]">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 10))}
                      className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-r-2xl font-number focus:outline-none focus:border-[#7B9D8A] text-sm"
                      placeholder="98765 43210"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">
                  Email Address <span className="font-normal text-[#6B7280]">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A] text-sm"
                    placeholder="Only if you have one"
                  />
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-[#E56363] font-semibold bg-[#FDECEC] px-3 py-2 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#7B9D8A] text-white font-bold rounded-2xl hover:bg-[#6D8F7D] transition-all shadow-soft-sm flex items-center justify-center gap-2 text-sm mt-2"
              >
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">6-digit OTP</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(digitsOnly(e.target.value).slice(0, 6))}
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A] text-sm font-number tracking-[0.35em]"
                    placeholder="••••••"
                    autoFocus
                  />
                </div>
              </div>

              {otpSentHint && (
                <p className="text-[11px] text-[#5DA271] font-semibold bg-[#E8F5EC] px-3 py-2 rounded-xl">
                  OTP sent (demo). Use <span className="font-number">{DEMO_OTP}</span> to continue.
                </p>
              )}

              {error && (
                <p className="text-[11px] text-[#E56363] font-semibold bg-[#FDECEC] px-3 py-2 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#7B9D8A] text-white font-bold rounded-2xl hover:bg-[#6D8F7D] transition-all shadow-soft-sm flex items-center justify-center gap-2 text-sm"
              >
                <span>Verify & Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    setOtp('');
                    setError('');
                    setOtpSentHint(false);
                  }}
                  className="text-xs font-semibold text-[#6B7280] hover:text-[#2F3A35]"
                >
                  Edit details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSentHint(true);
                    setError('');
                  }}
                  className="text-xs font-bold text-[#7B9D8A] hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-1">
            <p className="text-xs text-[#6B7280]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onGoToLogin}
                className="font-bold text-[#7B9D8A] hover:underline"
              >
                Log in with mobile
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
