export const normalizePhone=(value:string)=>{const digits=value.replace(/\D/g,'');return digits.length===12&&digits.startsWith('91')?digits.slice(2):digits};
export const validPhone=(value:string)=>/^[6-9]\d{9}$/.test(normalizePhone(value));export const validOtp=(value:string)=>/^\d{4,8}$/.test(value);
