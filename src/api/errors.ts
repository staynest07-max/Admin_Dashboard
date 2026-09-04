import type { ApiErrorBody } from './types';
export class ApiError extends Error { constructor(message:string, public readonly code:string, public readonly status:number, public readonly details?:unknown){super(message);this.name='ApiError'} }
export const isApiErrorBody=(value:unknown):value is ApiErrorBody=>Boolean(value&&typeof value==='object'&&(value as ApiErrorBody).success===false&&typeof (value as ApiErrorBody).error?.code==='string');
