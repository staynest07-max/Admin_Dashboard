const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem('merchant_token', token);
  else localStorage.removeItem('merchant_token');
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  return localStorage.getItem('merchant_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Request failed: ${res.status}`);
  }

  return json.data as T;
}

// ── Auth ──────────────────────────────────────────
export const authApi = {
  sendOtp: (phone: string) =>
    request<{ phone: string }>('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),

  verifyOtp: (phone: string, otp: string) =>
    request<{ token: string; merchant: Record<string, string> }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  signup: (data: { fullName: string; phone: string; businessName: string; email?: string; otp: string }) =>
    request<{ token: string; merchant: Record<string, unknown> }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => request<null>('/auth/logout', { method: 'POST' }),

  me: () => request<{ merchant: Record<string, unknown> }>('/auth/me'),
};

// ── Merchant ──────────────────────────────────────
export const merchantApi = {
  getProfile: () => request<Record<string, unknown>>('/merchant/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    request<Record<string, unknown>>('/merchant/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getDashboard: () => request<Record<string, unknown>>('/merchant/dashboard'),
  getEarnings: () => request<Record<string, unknown>>('/merchant/earnings'),
  savePaymentQr: (data: { paymentQrUrl?: string; upiId?: string }) =>
    request<Record<string, unknown>>('/merchant/payment-qr', { method: 'PUT', body: JSON.stringify(data) }),
};

// ── PGs ───────────────────────────────────────────
export const pgsApi = {
  list: () => request<unknown[]>('/pgs'),
  get: (id: string) => request<Record<string, unknown>>(`/pgs/${id}`),
  create: (data: Record<string, unknown>) =>
    request<Record<string, unknown>>('/pgs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    request<Record<string, unknown>>(`/pgs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<null>(`/pgs/${id}`, { method: 'DELETE' }),
  toggleStatus: (id: string, action: 'pause' | 'resume') =>
    request<Record<string, unknown>>(`/pgs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
    }),
};

// ── Residents ─────────────────────────────────────
export const residentsApi = {
  list: (params?: { status?: string; pgId?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<unknown[]>(`/residents${qs ? `?${qs}` : ''}`);
  },
  updatePaymentDay: (id: string, paymentDay: number) =>
    request<Record<string, unknown>>(`/residents/${id}/payment-day`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentDay }),
    }),
  toggleSms: (id: string, enabled: boolean) =>
    request<Record<string, unknown>>(`/residents/${id}/sms`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }),
};

// ── Enquiries & Visits ────────────────────────────
export const enquiriesApi = {
  list: () => request<unknown[]>('/enquiries'),
  updateStatus: (id: string, status: string) =>
    request<Record<string, unknown>>(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const visitsApi = {
  list: () => request<unknown[]>('/visits'),
  create: (data: Record<string, unknown>) =>
    request<Record<string, unknown>>('/visits', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string, category?: string) =>
    request<Record<string, unknown>>(`/visits/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, category }),
    }),
};

// ── Reviews & Notifications ───────────────────────
export const reviewsApi = {
  list: () => request<unknown[]>('/reviews'),
  reply: (id: string, reply: string) =>
    request<Record<string, unknown>>(`/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    }),
};

export const notificationsApi = {
  list: () => request<unknown[]>('/notifications'),
  markAllRead: () => request<unknown[]>('/notifications/read-all', { method: 'PATCH' }),
  markRead: (id: string) => request<Record<string, unknown>>(`/notifications/${id}/read`, { method: 'PATCH' }),
  clear: () => request<null>('/notifications', { method: 'DELETE' }),
};

// ── Occupancy ─────────────────────────────────────
export const occupancyApi = {
  get: (pgId: string) => request<Record<string, unknown>>(`/occupancy/${pgId}`),
  forecast: (pgId: string) => request<Record<string, unknown>>(`/occupancy/${pgId}/forecast`),
};
