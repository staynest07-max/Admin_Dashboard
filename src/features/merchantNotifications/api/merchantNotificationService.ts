import{apiClient}from'../../../api/client';import type{MerchantNotificationDto,NotificationListParams,NotificationPage}from'../../../contracts/merchantNotification';
const query=(p:NotificationListParams)=>{const q=new URLSearchParams();q.set('page',String(p.page??1));q.set('limit',String(p.limit??20));if(p.unread!==undefined)q.set('unread',String(p.unread));return q.toString()};
export const merchantNotificationService={
 list:async(params:NotificationListParams={})=>{const r=await apiClient.get<MerchantNotificationDto[]>(`/merchants/notifications?${query(params)}`);return{items:r.data,meta:r.meta as NotificationPage['meta']}},
 detail:async(id:string)=>(await apiClient.get<MerchantNotificationDto>(`/merchants/notifications/${id}`)).data,
 unreadCount:async()=>(await apiClient.get<{count:number}>('/merchants/notifications/unread-count')).data,
 markRead:async(id:string)=>(await apiClient.patch<MerchantNotificationDto>(`/merchants/notifications/${id}/read`,{})).data,
 markAllRead:async()=>(await apiClient.patch<{updated:number}>('/merchants/notifications/read-all',{})).data,
};

