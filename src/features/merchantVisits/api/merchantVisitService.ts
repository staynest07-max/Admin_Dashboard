import{apiClient}from'../../../api/client';import type{MerchantVisit,VisitRescheduleInput}from'../../../contracts/merchantVisit';
export const merchantVisitService={
 list:async()=>(await apiClient.get<MerchantVisit[]>('/merchants/visits')).data,
 detail:async(id:string)=>(await apiClient.get<MerchantVisit>(`/merchants/visits/${id}`)).data,
 confirm:async(id:string)=>(await apiClient.patch<MerchantVisit>(`/merchants/visits/${id}/confirm`,{})).data,
 reject:async(id:string)=>(await apiClient.patch<MerchantVisit>(`/merchants/visits/${id}/reject`,{})).data,
 reschedule:async(id:string,input:VisitRescheduleInput)=>(await apiClient.patch<MerchantVisit,VisitRescheduleInput>(`/merchants/visits/${id}/reschedule`,input)).data,
 complete:async(id:string)=>(await apiClient.patch<MerchantVisit>(`/merchants/visits/${id}/complete`,{})).data,
 noShow:async(id:string)=>(await apiClient.patch<MerchantVisit>(`/merchants/visits/${id}/no-show`,{})).data,
};

