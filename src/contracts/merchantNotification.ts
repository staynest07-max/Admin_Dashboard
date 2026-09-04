export const MERCHANT_NOTIFICATION_TYPES=['ENQUIRY_CREATED','ENQUIRY_UPDATED','VISIT_REQUESTED','VISIT_CONFIRMED','VISIT_REJECTED','VISIT_RESCHEDULED','VISIT_CANCELLED']as const;
export type MerchantNotificationType=typeof MERCHANT_NOTIFICATION_TYPES[number];
export interface MerchantNotificationDto{id:string;type:MerchantNotificationType;title:string;body:string;relatedEntity:{type:'ENQUIRY'|'VISIT';id:string}|null;isRead:boolean;readAt:string|null;createdAt:string}
export interface NotificationListParams{page?:number;limit?:number;unread?:boolean}
export interface NotificationPage{items:MerchantNotificationDto[];meta:{page:number;limit:number;total:number;totalPages:number}}

