const raw=import.meta.env.VITE_API_BASE_URL?.trim();
export function getApiBaseUrl(){if(!raw)throw new Error('VITE_API_BASE_URL is not configured');let url:URL;try{url=new URL(raw)}catch{throw new Error('VITE_API_BASE_URL must be an absolute URL')}if(!['http:','https:'].includes(url.protocol))throw new Error('VITE_API_BASE_URL must use HTTP or HTTPS');return url.toString().replace(/\/$/,'')}
