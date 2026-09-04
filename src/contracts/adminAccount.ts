import type { PlatformRole } from './auth';
import type { PgStatus } from './merchantPg';

export type AccountStatus='ACTIVE'|'SUSPENDED';
export interface PageMeta{page:number;limit:number;total:number;totalPages:number}
export interface PgSummary{total:number;live:number;pendingReview:number}
export interface AdminAccountListItem{id:string;role:PlatformRole;status:AccountStatus;phone:string;email:string|null;displayName:string|null;createdAt:string;updatedAt:string}
export type AdminAccountProfile=
  |{kind:'USER';fullName:string;profilePhotoUrl:string|null}
  |{kind:'MERCHANT';publicId:string;fullName:string;businessName:string;businessType:string|null;mobileNumber:string;email:string|null;profilePhotoUrl:string|null;businessAddress:string|null;city:string|null;state:string|null;pincode:string|null;onboardingDone:boolean}
  |{kind:'ADMIN'};
export interface AdminAccountDetail{id:string;role:PlatformRole;status:AccountStatus;phone:string;email:string|null;createdAt:string;updatedAt:string;profile:AdminAccountProfile;pgSummary?:PgSummary}
export interface AccountHistoryItem{id:string;fromStatus:AccountStatus;toStatus:AccountStatus;reason:string;actor:{id:string;role:PlatformRole};createdAt:string}
export interface AdminMerchantListItem{id:string;publicId:string;accountId:string;fullName:string;businessName:string;mobileNumber:string;email:string|null;city:string|null;onboardingDone:boolean;status:AccountStatus;pgSummary:PgSummary;createdAt:string;updatedAt:string}
export interface AdminMerchantDetail extends AdminMerchantListItem{businessType:string|null;profilePhotoUrl:string|null;businessAddress:string|null;state:string|null;pincode:string|null;suspendedAt:string|null;statusReason:string|null;account:{id:string;phone:string;email:string|null;role:PlatformRole;status:AccountStatus};pgStatusSummary:Partial<Record<PgStatus,number>>}
export interface AccountListParams{page?:number;limit?:number;role?:PlatformRole;status?:AccountStatus;search?:string}
export interface AccountHistoryParams{page?:number;limit?:number}
export interface MerchantListParams{page?:number;limit?:number;status?:AccountStatus;onboardingDone?:boolean;city?:string;search?:string}
export interface Page<T>{items:T[];meta:PageMeta}
