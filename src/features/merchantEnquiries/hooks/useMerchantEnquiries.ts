import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../../api/errors';
import type { MerchantEnquiryStatus } from '../../../contracts/merchantEnquiry';
import { merchantEnquiryService } from '../api/merchantEnquiryService';

export const merchantEnquiryKeys = {
  all: ['merchant-enquiries'] as const,
  detail: (id: string) => ['merchant-enquiries','detail',id] as const,
};
export const useMerchantEnquiries = () => useQuery({ queryKey: merchantEnquiryKeys.all, queryFn: merchantEnquiryService.list });
export const useMerchantEnquiry = (id?: string) => useQuery({ queryKey: merchantEnquiryKeys.detail(id ?? ''), queryFn: () => merchantEnquiryService.detail(id!), enabled: Boolean(id) });
export const useUpdateMerchantEnquiry = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MerchantEnquiryStatus }) => merchantEnquiryService.updateStatus(id, status),
    onSuccess: (enquiry) => {
      client.setQueryData(merchantEnquiryKeys.detail(enquiry.id), enquiry);
      void client.invalidateQueries({ queryKey: merchantEnquiryKeys.all });
      void client.invalidateQueries({ queryKey: merchantEnquiryKeys.detail(enquiry.id) });
    },
    onError: (error, variables) => {
      if (error instanceof ApiError && error.status === 409) {
        void client.invalidateQueries({ queryKey: merchantEnquiryKeys.all });
        void client.invalidateQueries({ queryKey: merchantEnquiryKeys.detail(variables.id) });
      }
    },
  });
};

