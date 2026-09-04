import { apiClient } from '../../../api/client';
import type { MerchantEnquiry, MerchantEnquiryUpdate } from '../../../contracts/merchantEnquiry';

export const merchantEnquiryService = {
  list: async () => (await apiClient.get<MerchantEnquiry[]>('/merchants/enquiries')).data,
  detail: async (id: string) => (await apiClient.get<MerchantEnquiry>(`/merchants/enquiries/${id}`)).data,
  updateStatus: async (id: string, status: MerchantEnquiryUpdate['status']) =>
    (await apiClient.patch<MerchantEnquiry, MerchantEnquiryUpdate>(`/merchants/enquiries/${id}`, { status })).data,
};

