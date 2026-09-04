export interface ApiSuccess<T> { success: true; data: T; message?: string; meta?: Record<string, unknown> }
export interface ApiErrorBody { success: false; error: { code: string; message: string; details?: unknown } }
export type HttpMethod = 'GET'|'POST'|'PATCH'|'DELETE';
