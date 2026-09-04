import type{MerchantVisitStatus}from'../../contracts/merchantVisit';
export type MerchantVisitAction='confirm'|'reject'|'reschedule'|'complete'|'noShow';
const actions:Record<MerchantVisitStatus,MerchantVisitAction[]>={REQUESTED:['confirm','reject','reschedule'],CONFIRMED:['complete','noShow'],RESCHEDULE_REQUESTED:['confirm','reject'],REJECTED:[],CANCELLED:[],COMPLETED:[],NO_SHOW:[]};
export const allowedVisitActions=(status:MerchantVisitStatus)=>actions[status];

