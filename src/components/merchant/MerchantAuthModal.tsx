import React, { useState } from 'react';
import { Building2, Mail, Lock, Phone, User, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface MerchantAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (ownerName: string) => void;
}

export const MerchantAuthModal: React.FC<MerchantAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('john.doe@zenstaypg.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('John Doe');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [businessName, setBusinessName] = useState('Sunrise PG & Hospitality');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(mode === 'login' ? 'John Doe' : fullName || 'John Doe');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-soft-lg space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#6B7280] hover:text-[#2F3A35] rounded-xl hover:bg-[#F3F1EC]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#7B9D8A] text-white flex items-center justify-center mx-auto shadow-soft-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#2F3A35]">
            {mode === 'login' ? 'Merchant (PG Owner) Login' : 'Register New PG Owner Account'}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {mode === 'login'
              ? 'Access your PG listings, availability, and enquiries.'
              : 'Join StayNest as a verified PG Merchant owner.'}
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] p-1 text-xs font-bold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login' ? 'bg-[#7B9D8A] text-white shadow-soft-sm' : 'text-[#6B7280]'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'signup' ? 'bg-[#7B9D8A] text-white shadow-soft-sm' : 'text-[#6B7280]'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">Business / PG Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2F3A35] mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-[#2F3A35] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2F3A35] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#7B9D8A] text-white font-bold rounded-2xl hover:bg-[#6D8F7D] transition-all shadow-soft-sm flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Login to Dashboard' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-[#6B7280]">
            Demo Mode: Log in instantly as <span className="font-bold text-[#7B9D8A]">John Doe</span> (PG Owner).
          </p>
        </div>
      </div>
    </div>
  );
};
