import React, { useRef, useState } from 'react';
import {
  Download,
  CheckCircle2,
  QrCode,
  Upload,
  Landmark,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { SettlementHistory } from '../../types/merchant';

interface EarningsViewProps {
  settlements: SettlementHistory[];
  totalRevenue?: number;
  monthlyRevenue?: number;
  pendingPayout?: number;
  paymentQrUrl?: string;
  upiId?: string;
  onSavePaymentQr?: (data: { paymentQrUrl: string; upiId: string }) => void;
}

export const EarningsView: React.FC<EarningsViewProps> = ({
  settlements,
  totalRevenue = 38400,
  monthlyRevenue = 6800,
  paymentQrUrl: initialQr = '',
  upiId: initialUpi = '',
  onSavePaymentQr,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [paymentQrUrl, setPaymentQrUrl] = useState(initialQr);
  const [upiId, setUpiId] = useState(initialUpi);
  const [showBank, setShowBank] = useState(false);
  const [savedHint, setSavedHint] = useState(false);

  const handleQrFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPaymentQrUrl(url);
  };

  const saveQr = () => {
    onSavePaymentQr?.({ paymentQrUrl, upiId });
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-[#2F3A35]">Money & your QR</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Upload your QR for residents, and track rent. Monthly SMS reminders go out on each resident’s payment date.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm space-y-1">
          <span className="text-xs font-bold text-[#6B7280]">Total money received</span>
          <p className="text-3xl font-extrabold text-[#2F3A35] font-number">${totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-[#6B7280]">All time</p>
        </div>
        <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm space-y-1">
          <span className="text-xs font-bold text-[#6B7280]">This month</span>
          <p className="text-3xl font-extrabold text-[#2F3A35] font-number">${monthlyRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-[#6B7280]">Rent collected</p>
        </div>
        <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-5 shadow-soft-sm space-y-1">
          <span className="text-xs font-bold text-[#6B7280]">SMS reminders</span>
          <p className="text-lg font-extrabold text-[#7B9D8A] mt-1">On rent day</p>
          <p className="text-[11px] text-[#6B7280]">Change dates under Residents</p>
        </div>
      </div>

      {/* PRIMARY: Payment QR */}
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] p-6 shadow-soft-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#DDE9E0] text-[#7B9D8A] shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-[#2F3A35]">Your payment QR</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Upload your PhonePe / GPay / Paytm QR for residents to scan when they pay rent.
            </p>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleQrFile}
        />

        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5 items-start">
          {paymentQrUrl ? (
            <div className="w-44 h-44 mx-auto sm:mx-0 rounded-2xl overflow-hidden border-2 border-[#D8C29B] bg-[#FFFFFF]">
              <img src={paymentQrUrl} alt="Payment QR" className="w-full h-full object-contain p-2" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-44 h-44 mx-auto sm:mx-0 rounded-2xl border-2 border-dashed border-[#D8C29B] bg-[#FAF8F4] flex flex-col items-center justify-center gap-2 text-[#7B9D8A]"
            >
              <Upload className="w-8 h-8" />
              <span className="text-xs font-bold">Upload QR</span>
            </button>
          )}

          <div className="space-y-3 text-xs">
            <ol className="space-y-2 text-[#2F3A35]">
              <li className="flex gap-2">
                <span className="font-bold text-[#7B9D8A]">1.</span>
                Open PhonePe / GPay / Paytm on your phone
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#7B9D8A]">2.</span>
                Open <strong>Your QR code</strong> and take a screenshot
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#7B9D8A]">3.</span>
                Tap Upload and choose that photo
              </li>
            </ol>

            <div>
              <label className="block font-bold text-[#2F3A35] mb-1">
                UPI ID <span className="font-normal text-[#6B7280]">(optional)</span>
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="name@ybl — only if you know it"
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2.5 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] font-bold hover:bg-[#DDE9E0]"
              >
                {paymentQrUrl ? 'Change QR photo' : 'Upload QR photo'}
              </button>
              <button
                type="button"
                onClick={saveQr}
                disabled={!paymentQrUrl}
                className="px-4 py-2.5 rounded-2xl bg-[#7B9D8A] text-white font-bold hover:bg-[#6D8F7D] disabled:opacity-40"
              >
                Save
              </button>
            </div>

            {savedHint && (
              <p className="text-[#5DA271] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Payment QR saved
              </p>
            )}

            {paymentQrUrl && (
              <p className="text-[#5DA271] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Ready — residents can scan your QR to pay
              </p>
            )}
          </div>
        </div>
      </div>

      {/* OPTIONAL bank — collapsed by default */}
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] shadow-soft-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowBank((v) => !v)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F3F1EC] text-[#6B7280]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2F3A35]">Bank account (optional)</h3>
              <p className="text-xs text-[#6B7280]">
              Most people skip this. QR is enough for residents to pay rent.
              </p>
            </div>
          </div>
          {showBank ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {showBank && (
          <div className="px-5 pb-5 border-t border-[#F3F1EC] space-y-3 pt-4 text-xs">
            <p className="text-[#6B7280]">
              Optional. Only add if you want to keep bank details here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Bank name (optional)"
                className="px-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
              <input
                placeholder="Account holder name (optional)"
                className="px-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
              />
              <input
                placeholder="Account number (optional)"
                className="px-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
              />
              <input
                placeholder="IFSC code (optional)"
                className="px-4 py-2.5 bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
              />
            </div>
            <button
              type="button"
              onClick={() => alert('Bank details saved (optional). You can still use only QR.')}
              className="px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] font-bold text-[#2F3A35] hover:bg-[#F3F1EC]"
            >
              Save bank details
            </button>
          </div>
        )}
      </div>

      {/* Money received history — simple words */}
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] p-6 shadow-soft-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-[#2F3A35]">Money received history</h3>
          <p className="text-xs text-[#6B7280]">Recent rent payments you recorded</p>
        </div>

        <div className="space-y-3">
          {settlements.map((st) => (
            <div
              key={st.id}
              className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#2F3A35] font-number">${st.amount}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5EC] text-[#5DA271]">
                    Received
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {st.payoutDate}
                  {st.utrNumber ? ` · Ref ${st.utrNumber}` : ''}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#7B9D8A] block">
                  {paymentQrUrl ? 'Via QR / UPI' : st.bankAccount}
                </span>
                <button className="text-[11px] font-bold text-[#6B7280] hover:text-[#2F3A35] inline-flex items-center gap-1 mt-0.5">
                  <Download className="w-3 h-3" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
