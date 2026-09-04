import type{MerchantNotificationDto}from'../../contracts/merchantNotification';import type{MerchantNotification}from'../../types/merchant';
export const formatNotificationTime=(value:string)=>new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));
export const toLegacyNotification=(n:MerchantNotificationDto):MerchantNotification=>({id:n.id,title:n.title,message:n.body,type:'System',sentAt:formatNotificationTime(n.createdAt),read:n.isRead});

