import{create}from'zustand';import type{AuthPrincipal}from'../contracts/auth';
type Status='initializing'|'unauthenticated'|'authenticated';interface State{status:Status;principal:AuthPrincipal|null;error:string|null;begin:()=>void;authenticated:(p:AuthPrincipal)=>void;unauthenticated:(error?:string|null)=>void}
export const isDashboardRole=(role:string)=>['MERCHANT','ADMIN','SUPER_ADMIN'].includes(role);
export const useAuthStore=create<State>(set=>({status:'initializing',principal:null,error:null,begin:()=>set({status:'initializing',error:null}),authenticated:(principal)=>{if(!isDashboardRole(principal.role))throw new Error('ROLE_FORBIDDEN');set({status:'authenticated',principal,error:null})},unauthenticated:(error=null)=>set({status:'unauthenticated',principal:null,error})}));
