import type{MerchantPg,PgStatus}from'./merchantPg';
export interface AdminMerchantSummary{id:string;publicId:string;fullName:string;businessName:string;email:string|null;mobileNumber:string}
export interface AdminPgListItem{id:string;publicId:string;name:string;location:{city:string;locality:string};status:PgStatus;submittedAt:string|null;statusUpdatedAt:string;merchant:AdminMerchantSummary}
export interface AdminPgHistory{id:string;fromStatus:PgStatus|null;toStatus:PgStatus;actorAccountId:string;actorRole:'USER'|'MERCHANT'|'ADMIN'|'SUPER_ADMIN';reason:string|null;createdAt:string}
export interface AdminPgDetail extends MerchantPg{merchant:AdminMerchantSummary;statusHistory:AdminPgHistory[]}
export interface AdminPgListParams{status?:PgStatus;page?:number;limit?:number}
export interface AdminPgPage{items:AdminPgListItem[];meta:{page:number;limit:number;total:number;totalPages:number;status:PgStatus}}

