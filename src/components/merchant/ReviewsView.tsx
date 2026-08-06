import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Flag, 
  Send, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  User
} from 'lucide-react';
import { MerchantReview } from '../../types/merchant';

interface ReviewsViewProps {
  reviews: MerchantReview[];
  onReplyToReview: (reviewId: string, replyText: string) => void;
  onReportReview: (reviewId: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  onReplyToReview,
  onReportReview
}) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');

  const validReviews = reviews.filter((r) => r.rating > 0);
  const totalCount = validReviews.length;
  const avgRating = totalCount > 0 
    ? (validReviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : '4.8';

  const fiveStarCount = validReviews.filter((r) => r.rating === 5).length;
  const fourStarCount = validReviews.filter((r) => r.rating === 4).length;
  const threeStarCount = validReviews.filter((r) => r.rating === 3).length;

  const handleSendReply = (reviewId: string) => {
    if (replyInput.trim()) {
      onReplyToReview(reviewId, replyInput.trim());
      setActiveReplyId(null);
      setReplyInput('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2F3A35]">Tenant Reviews & Ratings</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Read ratings and feedback left by residents, reply to tenant reviews, or report policy violations.
        </p>
      </div>

      {/* Rating Summary Card */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-6 shadow-soft-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Rating Display */}
        <div className="text-center md:text-left md:border-r md:border-[#F3F1EC] md:pr-6">
          <span className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">Average Rating</span>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
            <span className="text-4xl font-extrabold text-[#2F3A35] font-number">{avgRating}</span>
            <div className="flex text-[#F4B740]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-number">{totalCount} Total Tenant Reviews</p>
        </div>

        {/* Breakdown Bars */}
        <div className="md:col-span-2 space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-12 text-[#6B7280] font-semibold">5 Stars</span>
            <div className="flex-1 h-2 bg-[#F3F1EC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F4B740]"
                style={{ width: `${totalCount > 0 ? (fiveStarCount / totalCount) * 100 : 80}%` }}
              />
            </div>
            <span className="w-8 text-right font-bold text-[#2F3A35] font-number">{fiveStarCount}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-12 text-[#6B7280] font-semibold">4 Stars</span>
            <div className="flex-1 h-2 bg-[#F3F1EC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F4B740]"
                style={{ width: `${totalCount > 0 ? (fourStarCount / totalCount) * 100 : 20}%` }}
              />
            </div>
            <span className="w-8 text-right font-bold text-[#2F3A35] font-number">{fourStarCount}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-12 text-[#6B7280] font-semibold">3 Stars</span>
            <div className="flex-1 h-2 bg-[#F3F1EC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F4B740]"
                style={{ width: `${totalCount > 0 ? (threeStarCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="w-8 text-right font-bold text-[#2F3A35] font-number">{threeStarCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Reviews List */}
      <div className="space-y-4">
        <h2 className="font-bold text-base text-[#2F3A35]">Recent Tenant Reviews</h2>

        {reviews.length === 0 ? (
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-8 text-center text-xs text-[#6B7280]">
            No reviews received yet.
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#EAE8E4] rounded-[24px] p-6 shadow-soft-sm space-y-4"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {rev.userAvatar ? (
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-[#D8C29B]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#DDE9E0] text-[#7B9D8A] flex items-center justify-center font-bold text-sm">
                      {rev.userName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-sm text-[#2F3A35]">{rev.userName}</h3>
                    <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-[#7B9D8A]" />
                      <span>{rev.pgName}</span>
                      <span className="mx-1">•</span>
                      <span className="font-number">{rev.createdAt}</span>
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex text-[#F4B740]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-[#EAE8E4]'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment Text */}
              <p className="text-xs text-[#2F3A35] leading-relaxed bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#F3F1EC]">
                "{rev.comment}"
              </p>

              {/* Merchant Reply Box if Present */}
              {rev.merchantReply && (
                <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#D8C29B] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#7B9D8A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your Owner Reply:</span>
                  </div>
                  <p className="text-xs text-[#2F3A35]">{rev.merchantReply}</p>
                </div>
              )}

              {/* Inline Reply Input if Toggled */}
              {activeReplyId === rev.id && (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    placeholder="Write a warm, helpful response to tenant..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#6B7280]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#7B9D8A] text-white text-xs font-semibold hover:bg-[#6D8F7D]"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons Toolbar */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#F3F1EC]">
                {!rev.merchantReply && activeReplyId !== rev.id && (
                  <button
                    onClick={() => {
                      setActiveReplyId(rev.id);
                      setReplyInput('');
                    }}
                    className="flex items-center gap-1 text-[#7B9D8A] font-bold hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply to Review</span>
                  </button>
                )}

                <button
                  onClick={() => onReportReview(rev.id)}
                  className="flex items-center gap-1 text-[#6B7280] hover:text-[#E56363] ml-auto"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
