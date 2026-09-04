export const MERCHANT_ENQUIRY_STATUSES = ['NEW','CONTACTED','VISIT_SCHEDULED','CLOSED','CANCELLED','REJECTED','NO_RESPONSE'] as const;
export type MerchantEnquiryStatus = typeof MERCHANT_ENQUIRY_STATUSES[number];

export interface MerchantEnquiry {
  id: string;
  publicId: string;
  pg: { publicId: string | null; name: string; location: { address: string; city: string; locality: string } };
  user: { name: string; phone: string; email: string | null };
  details: { message: string | null; roomType: string | null; moveInDate: string | null };
  status: MerchantEnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantEnquiryUpdate { status: MerchantEnquiryStatus }

