import type { MerchantEnquiry, MerchantEnquiryStatus } from '../../contracts/merchantEnquiry';
import type { EnquiryItem } from '../../types/merchant';

export const displayEnquiryStatus = (status: MerchantEnquiryStatus) => status.replaceAll('_', ' ');
export const formatEnquiryDate = (value: string | null) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value)) : 'Not provided';

export function toEnquiryItem(enquiry: MerchantEnquiry): EnquiryItem {
  return {
    id: enquiry.id,
    tenantName: enquiry.user.name,
    tenantPhone: enquiry.user.phone,
    tenantEmail: enquiry.user.email ?? undefined,
    pgId: enquiry.pg.publicId ?? '',
    pgName: enquiry.pg.name,
    roomType: enquiry.details.roomType ?? 'Not specified',
    moveInDate: formatEnquiryDate(enquiry.details.moveInDate),
    status: enquiry.status,
    createdDate: formatEnquiryDate(enquiry.createdAt),
    notes: enquiry.details.message ?? undefined,
  };
}

