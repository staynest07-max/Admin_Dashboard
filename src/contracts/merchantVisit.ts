export const MERCHANT_VISIT_STATUSES=['REQUESTED','CONFIRMED','RESCHEDULE_REQUESTED','REJECTED','CANCELLED','COMPLETED','NO_SHOW']as const;
export type MerchantVisitStatus=typeof MERCHANT_VISIT_STATUSES[number];
export interface MerchantVisit{ id:string;publicId:string;pg:{publicId:string|null;name:string;location:{address:string;city:string;locality:string}};enquiry:{publicId:string}|null;user:{name:string;phone:string;email:string|null};requestedDate:string;requestedTime:string;requestedStartAt:string;requestedEndAt:string;note:string|null;status:MerchantVisitStatus;createdAt:string;updatedAt:string }
export interface VisitRescheduleInput{visitDate:string;visitTime:string;timeZone:string;note?:string}

