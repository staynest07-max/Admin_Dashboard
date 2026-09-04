import type { MerchantEnquiryStatus } from '../../contracts/merchantEnquiry';
const transitions: Record<MerchantEnquiryStatus, MerchantEnquiryStatus[]> = {
  NEW: ['CONTACTED','REJECTED','CANCELLED'],
  CONTACTED: ['VISIT_SCHEDULED','CLOSED','NO_RESPONSE','REJECTED','CANCELLED'],
  VISIT_SCHEDULED: ['CLOSED','NO_RESPONSE','CANCELLED'],
  CLOSED: [], CANCELLED: [], REJECTED: [], NO_RESPONSE: [],
};
export const allowedEnquiryTransitions = (status: MerchantEnquiryStatus) => transitions[status];

