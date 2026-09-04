import type{VisitRescheduleInput}from'../../contracts/merchantVisit';
export function validateReschedule(input:VisitRescheduleInput):string|null{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(input.visitDate))return'Use a valid date.';
 if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(input.visitTime))return'Use 24-hour HH:mm time.';
 const parts=input.visitDate.split('-').map(Number),date=new Date(Date.UTC(parts[0],parts[1]-1,parts[2]));
 if(date.getUTCFullYear()!==parts[0]||date.getUTCMonth()!==parts[1]-1||date.getUTCDate()!==parts[2])return'Use a valid calendar date.';
 try{new Intl.DateTimeFormat('en',{timeZone:input.timeZone}).format()}catch{return'Use a valid IANA timezone.'}
 const now=new Date(),today=Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()),target=date.getTime();
 if(target<today)return'Visit cannot be in the past.';if(target>today+366*86400000)return'Visit must be within 366 days.';return null;
}

