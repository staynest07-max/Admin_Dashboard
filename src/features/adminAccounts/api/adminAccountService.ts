import{apiClient}from'../../../api/client';import type{AccountHistoryItem,AccountHistoryParams,AccountListParams,AdminAccountDetail,AdminAccountListItem,Page}from'../../../contracts/adminAccount';
function query(values:Record<string,unknown>){const q=new URLSearchParams();for(const[k,v]of Object.entries(values))if(v!==undefined&&v!==''&&v!==null)q.set(k,String(v));return q.toString()}
const page=<T>(data:T[],meta?:Record<string,unknown>):Page<T>=>({items:data,meta:meta as unknown as Page<T>['meta']});
export const adminAccountService={
 list:async(p:AccountListParams={})=>{const r=await apiClient.get<AdminAccountListItem[]>(`/admin/accounts?${query({page:p.page??1,limit:p.limit??20,role:p.role,status:p.status,search:p.search?.trim()||undefined})}`);return page(r.data,r.meta)},
 detail:async(id:string)=>(await apiClient.get<AdminAccountDetail>(`/admin/accounts/${id}`)).data,
 history:async(id:string,p:AccountHistoryParams={})=>{const r=await apiClient.get<AccountHistoryItem[]>(`/admin/accounts/${id}/history?${query({page:p.page??1,limit:p.limit??20})}`);return page(r.data,r.meta)},
 suspend:async(id:string,reason:string)=>(await apiClient.patch<AdminAccountDetail,{reason:string}>(`/admin/accounts/${id}/suspend`,{reason:reason.trim()})).data,
 activate:async(id:string,reason:string)=>(await apiClient.patch<AdminAccountDetail,{reason:string}>(`/admin/accounts/${id}/activate`,{reason:reason.trim()})).data,
};
