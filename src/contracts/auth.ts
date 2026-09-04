export const ROLES = ['USER', 'MERCHANT', 'ADMIN', 'SUPER_ADMIN'] as const;
export type PlatformRole = typeof ROLES[number];
export interface AuthTokens { account: { id: string; role: PlatformRole }; accessToken: string; refreshToken: string; expiresIn: number; refreshExpiresAt: string }
export interface AuthPrincipal { accountId: string; role: PlatformRole; sessionId: string; userId?: string; merchantId?: string }
export interface AuthMeResult { principal: AuthPrincipal }
export interface RequestOtpResult { expiresInSeconds: number }
