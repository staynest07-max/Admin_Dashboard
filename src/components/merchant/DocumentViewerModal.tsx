import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Download, ExternalLink, ShieldCheck, ZoomIn } from 'lucide-react';
import { MerchantDocument, DocumentStatus } from '../../types/merchant';

interface DocumentViewerModalProps {
  document: MerchantDocument | null;
  merchantName: string;
  onClose: () => void;
  onUpdateStatus: (docId: string, status: DocumentStatus, reason?: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  merchantName,
  onClose,
  onUpdateStatus,
}) => {
  if (!document) return null;

  const [rejectionReason, setRejectionReason] = useState(document.rejectionReason || '');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [zoom, setZoom] = useState(false);

  const handleApprove = () => {
    onUpdateStatus(document.id, 'Verified');
    onClose();
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    onUpdateStatus(document.id, 'Changes Requested', rejectionReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2F3A35]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[28px] max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-soft-lg border border-[#EAE8E4] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EAE8E4] flex items-center justify-between bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DDE9E0] text-[#7B9D8A] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2F3A35] text-base">{document.type} Verification</h3>
              <p className="text-xs text-[#6B7280]">Merchant: {merchantName} • Uploaded {document.uploadedAt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#2F3A35] hover:bg-[#EAE8E4] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Document Preview Box */}
          <div className="relative rounded-2xl overflow-hidden border border-[#EAE8E4] bg-[#F3F1EC] min-h-[320px] flex items-center justify-center group">
            <img
              src={document.fileUrl}
              alt={document.type}
              className={`object-contain transition-transform duration-300 max-h-[420px] w-full ${
                zoom ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setZoom(!zoom)}
            />

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setZoom(!zoom)}
                className="p-2 bg-white/90 backdrop-blur text-[#2F3A35] rounded-xl text-xs font-medium shadow-soft-sm hover:bg-white flex items-center gap-1"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                {zoom ? 'Reset' : 'Zoom'}
              </button>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/90 backdrop-blur text-[#2F3A35] rounded-xl text-xs font-medium shadow-soft-sm hover:bg-white flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Original
              </a>
            </div>
          </div>

          {/* Document Metadata Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4]">
            <div>
              <span className="text-xs text-[#6B7280] block">File Name</span>
              <span className="text-sm font-semibold text-[#2F3A35] font-mono break-all">{document.fileName}</span>
            </div>

            {document.documentNumber && (
              <div>
                <span className="text-xs text-[#6B7280] block">Document ID / Registration #</span>
                <span className="text-sm font-bold text-[#7B9D8A] font-mono">{document.documentNumber}</span>
              </div>
            )}

            <div>
              <span className="text-xs text-[#6B7280] block">Current Verification Status</span>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  document.status === 'Verified'
                    ? 'bg-[#E8F5EC] text-[#2E7D32]'
                    : document.status === 'Changes Requested'
                    ? 'bg-[#DDE9E0] text-[#7B9D8A]'
                    : 'bg-[#FFF8E7] text-[#CC8B00]'
                }`}
              >
                {document.status}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#6B7280] block">Upload Timestamp</span>
              <span className="text-sm font-medium text-[#2F3A35] font-number">{document.uploadedAt}</span>
            </div>
          </div>

          {/* Rejection / Correction Form */}
          {showRejectForm ? (
            <form onSubmit={handleRejectSubmit} className="p-4 rounded-2xl bg-[#FDECEC] border border-[#E56363]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#C62828] text-xs font-semibold">
                <AlertTriangle className="w-4 h-4" />
                <span>Specify Reason for Rejecting or Requesting Changes</span>
              </div>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Image is blurry, registration number truncated, name mismatch..."
                className="w-full p-3 bg-white border border-[#EAE8E4] rounded-xl text-xs text-[#2F3A35] focus:outline-none focus:ring-2 focus:ring-[#E56363]"
                required
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 text-xs text-[#6B7280] hover:bg-[#FFFFFF] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#E56363] text-white rounded-xl hover:bg-[#C62828]"
                >
                  Send Changes Request to Merchant
                </button>
              </div>
            </form>
          ) : document.rejectionReason ? (
            <div className="p-3.5 bg-[#DDE9E0] border border-[#D8C29B] rounded-2xl text-xs text-[#7B9D8A]">
              <strong>Note to Merchant:</strong> {document.rejectionReason}
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-[#EAE8E4] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              className="px-4 py-2 text-xs font-medium text-[#C62828] bg-[#FDECEC] border border-[#E56363]/20 rounded-xl hover:bg-[#E56363] hover:text-white transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Request Changes / Reject
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#6B7280] hover:bg-[#EAE8E4] rounded-xl transition-all"
            >
              Close
            </button>
            <button
              onClick={handleApprove}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#5DA271] hover:bg-[#2E7D32] rounded-xl shadow-soft-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
