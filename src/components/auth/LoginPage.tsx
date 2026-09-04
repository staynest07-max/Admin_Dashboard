import React, { useState } from 'react';
import { Building2, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRequestOtp, useVerifyOtp, authMessage } from '../../features/auth/hooks/useAuth';
import { normalizePhone, validOtp, validPhone } from '../../features/auth/validation';

interface LoginPageProps {
  onGoToSignup: () => void;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
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

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToSignup }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSentHint, setOtpSentHint] = useState(false);
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validPhone(phone)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    try { await requestOtp.mutateAsync(normalizePhone(phone)); setStep('otp'); setOtpSentHint(true); setOtp(''); }
    catch (reason) { setError(authMessage(reason)); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validOtp(otp)) {
      setError('Enter the OTP sent to your registered mobile number.');
      return;
    }
    try { await verifyOtp.mutateAsync({ phone: normalizePhone(phone), otp }); }
    catch (reason) { setError(authMessage(reason)); }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#7B9D8A] text-white flex items-center justify-center mx-auto shadow-soft-md mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#2F3A35] tracking-tight">StayNest</h1>
          <p className="text-sm text-[#6B7280] mt-1">Merchant Owner Login</p>
        </div>

        <div className="bg-white border border-[#EAE8E4] rounded-[28px] p-6 sm:p-8 shadow-soft-lg space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#2F3A35]">
              {step === 'phone' ? 'Login with mobile' : 'Verify OTP'}
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              {step === 'phone'
                ? 'No email needed — sign in with your registered mobile number.'
                : `Enter the OTP sent to ${formatPhoneDisplay(phone)}`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">Mobile Number</label>
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
                      className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] border border-[#EAE8E4] rounded-r-2xl focus:outline-none focus:border-[#7B9D8A] text-sm font-number"
                      placeholder="98765 43210"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-[11px] text-[#E56363] font-semibold bg-[#FDECEC] px-3 py-2 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#7B9D8A] text-white font-bold rounded-2xl hover:bg-[#6D8F7D] transition-all shadow-soft-sm flex items-center justify-center gap-2 text-sm"
              >
                <span>Send OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
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
                  OTP sent. Check your registered authentication channel.
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
                <span>Verify & Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setError('');
                    setOtpSentHint(false);
                  }}
                  className="text-xs font-semibold text-[#6B7280] hover:text-[#2F3A35]"
                >
                  Change number
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

          <div className="text-center space-y-2 pt-1">
            <p className="text-xs text-[#6B7280]">
              New PG owner?{' '}
              <button
                type="button"
                onClick={onGoToSignup}
                className="font-bold text-[#7B9D8A] hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
