import type{AdminAccountDetail,AdminAccountListItem}from'../../contracts/adminAccount';
export interface AdminAccountView{identity:string;secondaryIdentity:string|null;merchantPublicId:string|null}
export function toAdminAccountView(account:AdminAccountListItem|AdminAccountDetail):AdminAccountView{
  if('displayName'in account)return{identity:account.displayName||account.phone,secondaryIdentity:account.email,merchantPublicId:null};
  if(account.profile.kind==='USER')return{identity:account.profile.fullName||account.phone,secondaryIdentity:account.email,merchantPublicId:null};
  if(account.profile.kind==='MERCHANT')return{identity:account.profile.businessName||account.profile.fullName,secondaryIdentity:account.profile.fullName,merchantPublicId:account.profile.publicId};
  return{identity:account.role==='SUPER_ADMIN'?'Super Admin':'Admin',secondaryIdentity:account.email,merchantPublicId:null};
}
