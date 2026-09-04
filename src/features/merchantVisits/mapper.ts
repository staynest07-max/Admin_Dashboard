import type{MerchantVisit,MerchantVisitStatus}from'../../contracts/merchantVisit';import type{VisitItem}from'../../types/merchant';
export const displayVisitStatus=(s:MerchantVisitStatus)=>s.replaceAll('_',' ');
export const toVisitItem=(v:MerchantVisit):VisitItem=>({id:v.id,visitorName:v.user.name,visitorPhone:v.user.phone,pgId:v.pg.publicId??'',pgName:v.pg.name,visitDate:v.requestedDate,visitTime:v.requestedTime,status:v.status,category:['COMPLETED','NO_SHOW'].includes(v.status)?'Completed':['CANCELLED','REJECTED'].includes(v.status)?'Cancelled':'Upcoming',notes:v.note??undefined});

